/**
 * SiteManualResultPage.jsx 
 * Component that represents the result page for guest users
 * 
 */

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, generatePath } from "react-router-dom";
// React-Bootstrap components
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Stack from 'react-bootstrap/Stack';
import Table from "react-bootstrap/Table";
// Components
import Loading from "../components/Loading";
// API
import ServerAPI from "../apis/ServerAPI";
const ManualResultPage = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    // State
    const [manualResults, setManualResults] = useState([]);
    const [tablebody, setTableBody] = useState([]);

    // Fetch the available result
    useEffect(() => {
        const fetchResult = async () => {
            try {
                const response = await ServerAPI.get(`/manual/results/${location.state.site_id}`,
                    {
                        headers: {
                            "token": localStorage.getItem("token"),
                        }
                    }
                );
                setManualResults(response.data.result);
            } catch (err) {
                console.log(err);
            }
        }
        fetchResult();
    }, [location, setManualResults])

    // Tabulate the results
    useEffect(() => {
        const renderRows = () => {
            let rows = [];

            for (const principle in manualResults) {
                const guidelines = manualResults[principle];
                const guidelineKeys = Object.keys(guidelines);

                guidelineKeys.forEach((guideline, guidelineIndex) => {
                    const criteria = guidelines[guideline];
                    criteria.forEach((criterion, criterionIndex) => {
                        rows.push(
                            <tr key={`${principle}-${guideline}-${criterionIndex}`}>
                                {guidelineIndex === 0 && criterionIndex === 0 && (
                                    <td
                                        rowSpan={Object.values(guidelines).reduce((total, criteria) => total + criteria.length, 0)}
                                        className="align-middle">
                                        {principle}
                                    </td>
                                )}
                                {criterionIndex === 0 && (
                                    <td
                                        rowSpan={criteria.length}
                                        className="align-middle">
                                        {guideline}
                                    </td>
                                )}
                                <td className="align-middle">{criterion.title}</td>
                                <td className="align-middle">{criterion.result}</td>
                                <td className="align-middle">{criterion.observation}</td>
                            </tr>
                        );
                    });
                });
            }
            setTableBody(rows);
        }
        renderRows();
    }, [setTableBody, manualResults]);

    // Callback - Home button 
    const onHomeBtnClick = (e) => {
        e.preventDefault();
        navigate(generatePath("/dashboard"));
    }

    // Callback - Site Home button 
    const onSiteHomeBtnClick = (e) => {
        e.preventDefault();
        navigate(generatePath(`/dashboard/${location.state.site_id}`));
    }

    // Render the component
    return (
        <Stack gap={2} className="p-5">
            <Stack direction="horizontal" gap={5}>
                <h1 className="display-4"> Results </h1>
                {/* For navigation to user dashboard or site dashboard */}
                <ButtonToolbar aria-label="Toolbar with button groups" className="ms-auto">
                    <ButtonGroup className="m-2">
                        <Button size="sm" onClick={(e) => onHomeBtnClick(e)}>
                            <Stack direction="horizontal" gap={2}>
                                <i className="fa-solid fa-house" />
                                <>Home</>
                            </Stack>
                        </Button>
                        <Button size="sm" onClick={(e) => onSiteHomeBtnClick(e)}>
                            <Stack direction="horizontal" gap={2}>
                                <i className="fa-solid fa-file-export" />
                                <>Site Home</>
                            </Stack>
                        </Button>
                    </ButtonGroup>
                </ButtonToolbar>
            </Stack>
            <div className="ms-auto">
                <span className="">Target webpage: </span>
                <a className="align-items-center" target="_blank" href={decodeURIComponent(location.state.url)} rel="noreferrer">{decodeURIComponent(location.state.url)}</a>
            </div>
            {/* Result table */}
            <Table bordered responsive>
                <thead>
                    <tr>
                        <th className="text-center">Principle</th>
                        <th className="text-center">Guideline</th>
                        <th className="text-center">Success Criteria</th>
                        <th className="text-center">Result</th>
                        <th className="text-center">Observation</th>
                    </tr>
                </thead>
                {(tablebody) ? (<tbody>{tablebody}</tbody>) : (<tbody><tr><td>{<Loading />}</td></tr></tbody>)}
            </Table>
        </Stack>
    )
}

export default ManualResultPage;