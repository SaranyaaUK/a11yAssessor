/**
 * 
 *  Header.jsx
 * 
 *  Defines the header component
 * 
 */


import React from "react";

const Header = () => {
    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand active" aria-current="page" href="/">a11yAssessor</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse flex-row-reverse" id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                            <a className="nav-link" href="/">About</a>
                            <a className="nav-link" href="/">Features</a>
                            <a className="nav-link" href="/">Login</a>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Header;