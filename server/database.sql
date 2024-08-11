-- Postgres Database Schema

-- Create Database
CREATE DATABASE a11yassessordb;

-- Users table
CREATE TABLE users(
    user_id uuid DEFAULT uuid_generate_v4(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id),
    UNIQUE (email)
);

-- Sites table

CREATE TABLE sites(
    site_id uuid DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    PRIMARY KEY (site_id)
);

-- Evaluators table

CREATE TABLE evaluators(
    evaluator_id uuid DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    site_id uuid NOT NULL,
    PRIMARY KEY (evaluator_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (site_id) REFERENCES sites(site_id) ON DELETE CASCADE
);

-- Result timestamp table

CREATE TABLE result_time (
    time_id uuid DEFAULT uuid_generate_v4(),
    site_id uuid NOT NULL,
    auto_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    manual_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (time_id),
    FOREIGN KEY (site_id) REFERENCES sites(site_id) ON DELETE CASCADE,
    UNIQUE (site_id)
);

-- Automated results table

CREATE TABLE automated_results (
    automated_result_id uuid DEFAULT uuid_generate_v4(),
    result jsonb NOT NULL,
    evaluator_id uuid NOT NULL,
    PRIMARY KEY (automated_result_id),
    FOREIGN KEY (evaluator_id) REFERENCES evaluators(evaluator_id) ON DELETE CASCADE,
    UNIQUE (evaluator_id)
);

-- Manual Evaluation

-- To populate the principles table
\copy principles(title, description) FROM '\server\utils\evaluationForm\principles.csv' DELIMITER ',' CSV;

-- Principles Table
CREATE TABLE principles(
    principle_id uuid DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    PRIMARY KEY (principle_id),
    UNIQUE (title)
);

-- To populate the guidelines table
\copy guidelines(title, moreinfo, benefits, principle_name) FROM '\server\utils\evaluationFrom\guidelines.csv' DELIMITER ',' CSV;

-- Guidelines Table 
CREATE TABLE guidelines (
    guideline_id uuid DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    moreinfo TEXT ARRAY,
    benefits TEXT ARRAY,
    principle_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (guideline_id)
);

--  Success Criteria Table 
CREATE TABLE success_criteria (
    sc_id uuid DEFAULT uuid_generate_v4(),
    guideline_id uuid NOT NULL,
    principle_id uuid NOT NULL,
    PRIMARY KEY (sc_id),
    FOREIGN KEY (guideline_id) REFERENCES guidelines(guideline_id) ON DELETE CASCADE,
    FOREIGN KEY (principle_id) REFERENCES principles(principle_id) ON DELETE CASCADE
);

-- Trigger to add a mapping for principles and guidelines
CREATE TRIGGER success_criteria_populate AFTER INSERT 
ON guidelines FOR EACH ROW
EXECUTE FUNCTION populate_sc();

-- Function to update the table
CREATE OR REPLACE FUNCTION populate_sc()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS
$$
DECLARE
p_id UUID;
BEGIN
    SELECT (principle_id) FROM principles WHERE title=NEW.principle_name INTO p_id;

    INSERT INTO success_criteria(principle_id, guideline_id) VALUES (p_id, NEW.guideline_id);
    RETURN NEW;
END;
$$;

--  Manual Evaluation Questions Table
CREATE TABLE manual_questions (
    q_id uuid DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    guideline_name VARCHAR(255),
    q_text VARCHAR(500),
    instructions TEXT ARRAY,
    extras TEXT ARRAY,
    sc_id uuid,
    PRIMARY KEY (q_id),
    FOREIGN KEY (sc_id) REFERENCES success_criteria(sc_id) ON DELETE CASCADE,
    UNIQUE (title, sc_id)
);

-- To populate the questions table
\copy manual_questions(title, guideline_name, q_text, instructions, extras) FROM '\server\utils\evaluationFrom\questions.csv' DELIMITER ',' CSV;

-- Trigger to add a mapping for principles and guidelines

CREATE TRIGGER manual_question_update
BEFORE INSERT ON manual_questions
FOR EACH ROW
EXECUTE FUNCTION update_manual_question();

-- FUNCTION to update the table
CREATE OR REPLACE FUNCTION update_manual_question()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS
$$
DECLARE
    g_id UUID;
    new_sc_id UUID;
BEGIN
    -- Fetch the guideline ID using the title
    SELECT guideline_id INTO g_id 
    FROM guidelines 
    WHERE title = NEW.guideline_name;

    -- Fetch the success criteria ID using the guideline ID
    SELECT sc_id INTO new_sc_id 
    FROM success_criteria 
    WHERE guideline_id = g_id;

    -- Set the sc_id field in the new row
    NEW.sc_id = new_sc_id;

    RETURN NEW;
END;
$$;

-- Manual evaluation result Table
CREATE TABLE manual_results (
    manual_result_id uuid DEFAULT uuid_generate_v4(),
    q_id uuid NOT NULL,
    observation TEXT DEFAULT '',
    result VARCHAR(32) DEFAULT 'Not Evaluated',
    evaluator_id uuid NOT NULL,
    PRIMARY KEY (manual_result_id),
    FOREIGN KEY (evaluator_id) REFERENCES evaluators(evaluator_id) ON DELETE CASCADE,
    FOREIGN KEY (q_id) REFERENCES manual_questions(q_id) ON DELETE CASCADE,
    UNIQUE (q_id, evaluator_id)
);