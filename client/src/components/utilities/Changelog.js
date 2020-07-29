import React from 'react';
import { Link } from '@reach/router';

const Changelog = () => {
    return (
        <div>
            <div className="container transparent-background p-3 changelog">
                <div className="row">
                    <div className="col text-right">
                        <Link to="/"><h3>Go back to Dashboard</h3></Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col text-left">
                        <ul className="fs28">
                            <li>7/29/2020
                                <ul>
                                    <li>Added global context object</li>
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
