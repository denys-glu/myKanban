import React from 'react';
import { Link } from '@reach/router';

import Storage from './Storage';

const Changelog = () => {
    const currProjectName =  Storage.get("currentSession")["name"];
    return (
        <div>
            <div className="container transparent-background p-3 mt-5 changelog">
                <div className="row">
                    <div className="col text-right">
                        <Link to={`/project/${currProjectName}/tickets`}><h3>Go back to Dashboard</h3></Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col text-left">
                        <ul className="fs28">
                            <li>8/11/2020
                                <ul>
                                    <li>Added Projects feature</li>
                                    <li>Now you can create Projects and add tickets to them, and they will be in the right scope.</li>
                                </ul>    
                            </li>
                            <li>8/04/2020
                                <ul>
                                    <li>Added API to create Projects</li>
                                    <li>Added API to add ticket to Project</li>
                                </ul>    
                            </li>
                            <li>7/31/2020
                                <ul>
                                    <li>Added .env files with PROD and DEV API urls</li>
                                    <li>CRUD pattern is now fully supported</li>
                                    <li>All statuses columns are now displayed even if there is no tickets with such status</li>
                                </ul>    
                            </li>
                            <li>7/29/2020
                                <ul>
                                    <li>Added global context object</li>
                                    <li>Added responsivnes to the ticket form</li>
                                </ul>    
                            </li>
                            <li>7/28/2020
                                <ul>
                                    <li>Added edit functionality one form serves two purposes</li>
                                    <li>Updated UI to show settings icon on hover</li>
                                    <li>Added changelog page</li>
                                    <li>Added Description field to ticket with validation</li>
                                    <li>Added new API toure to get one ticket</li>
                                </ul>    
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Changelog