/**
 * SiteDashboardBody.jsx 
 * 
 * Component that represents the body content of the site dashboard page
 * 
 */

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, generatePath } from "react-router-dom";
// React-Bootstrap components
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
// Components
import SiteEvaluationCard from "./SiteEvaluationCard";
// API
import ServerAPI from "../apis/ServerAPI";
// Notification
import { toast } from "react-toastify";


const SiteDashboardBody = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // States
    const [site, setSite] = useState({});
    const [timeStamp, setTimeStamp] = useState({});
    const [isManualResultButtonDisabled, setManualResultButtonDisabled] = useState(true);
    const [isAutoResultButtonDisabled, setAutoResultButtonDisabled] = useState(true);
    const [isResultloading, setResultLoading] = useState(false);

    useEffect(() => {
        const getSiteInfo = async () => {
            try {
                const urlpath = location.pathname.split("/");
                const site_id = urlpath[urlpath.length - 1];
                const response = await ServerAPI.get(`/site/${site_id}`, {
                    headers: {
                        "token": localStorage.getItem("token")
                    }
                });
                const parseRes = response.data;
                setSite(parseRes.site);
                setTimeStamp(parseRes.timeStamp);

                // Check and enable the Auto result button
                const autoResponse = await ServerAPI.get(`/automated/results/${site_id}`,
                    {
                        headers: {
                            "token": localStorage.getItem("token"),
                        }
                    }
                );
                if (autoResponse.data.result) {
                    setAutoResultButtonDisabled(false);
                }

                // Check and enable the Manual result button
                const manualResponse = await ServerAPI.get(`/manual/results/${site_id}`,
                    {
                        headers: {
                            "token": localStorage.getItem("token"),
                        }
                    }
                );

                if (manualResponse.data.result) {
                    setManualResultButtonDisabled(false);
                }
            } catch (err) {
                console.log(err);
                toast.error("Cannot retrive data!", { position: "top-center" });
            }
        }
        getSiteInfo();
    }, [location]);

    // Callback - Automated Evaluation button
    const onAutomatedEvalBtnClick = async (site_id, url) => {
        try {
            setResultLoading(true);
            const body = { site_id, url };
            const response = await ServerAPI.post(`/automated/results`, JSON.stringify(body),
                {
                    headers: {
                        "Content-type": "application/json",
                        "token": localStorage.getItem("token")
                    }
                });

            if (response.data.result) {
                setAutoResultButtonDisabled(false);
            } else {
                setAutoResultButtonDisabled(true);
            }
            setTimeStamp(response.data.result.result_time);
            setResultLoading(false);
        } catch (err) {
            console.log(err);
        }
    }

    // Callback - Automated Evaluation result button
    const onAutomatedResultBtnClick = () => {
        const path = generatePath(`/result/automated/${site.site_id}`);
        navigate(path, {
            state: {
                "url": site.url,
                "site_id": site.site_id
            }
        });
    }

    // Callback - Manual Evaluation button
    const onManualEvalBtnClick = () => {
        const path = generatePath(`/manual/${site.site_id}`);
        navigate(path, {
            state: {
                "url": site.url,
                "site_id": site.site_id
            }
        });
        toast.info("Save your data as you progress using the save button!", { position: "top-center" });
    }

    // Callback - Manual Evaluation result button
    const onManualResultBtnClick = () => {
        const path = generatePath(`/result/manual/${site.site_id}`);
        navigate(path, {
            state: {
                "url": site.url,
                "site_id": site.site_id
            }
        });
    }

    // Callback - Home button 
    const onHomeBtnClick = (e) => {
        e.preventDefault();
        navigate(generatePath("/dashboard"));
    }

    // Render the component
    return (
        <Container className="overflow-auto p-5" style={{ height: "70vh" }} fluid>
            {/* Header  */}
            <Stack gap={5}>
                <Stack direction="horizontal" gap={5}>
                    {/*  Site name info */}
                    {(!site) ? (<h2>Welcome</h2>) : (<h2>Dashboard - {site.name} </h2>)}
                    <ButtonToolbar aria-label="Toolbar with button groups" className="ms-auto">
                        <ButtonGroup className="m-2">
                            <Button size="sm" onClick={(e) => onHomeBtnClick(e)}>
                                <Stack direction="horizontal" gap={2}>
                                    <i className="fa-solid fa-house" />
                                    <>Home</>
                                </Stack>
                            </Button>
                        </ButtonGroup>
                    </ButtonToolbar>
                </Stack>
                <Row>
                    {/* Automated Evaluation Column */}
                    <Col>
                        <SiteEvaluationCard
                            cardHeader={"Automated Evaluation"}
                            isButtonDisabled={isAutoResultButtonDisabled}
                            timeStamp={timeStamp.auto_time}
                            site={site}
                            isResultloading={isResultloading}
                            iconClass={"fa-solid fa-gears fa-10x"}
                            evalBtnClick={onAutomatedEvalBtnClick}
                            resultBtnClick={onAutomatedResultBtnClick}
                        />
                    </Col>
                    {/* Manual Evaluation Column */}
                    <Col>
                        <SiteEvaluationCard
                            cardHeader={"Manual Evaluation"}
                            isButtonDisabled={isManualResultButtonDisabled}
                            timeStamp={timeStamp.manual_time}
                            site={site}
                            isResultloading={false}
                            iconClass={"fa-solid fa-chalkboard-user fa-10x"}
                            evalBtnClick={onManualEvalBtnClick}
                            resultBtnClick={onManualResultBtnClick}
                        />
                    </Col>
                </Row>
            </Stack>
        </Container >
    )
}

export default SiteDashboardBody;