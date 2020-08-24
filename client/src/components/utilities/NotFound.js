import React from 'react';
import { Link } from 'react-router-dom';
import style from './NotFound.css';
function NotFound() {
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col">
                    <h2><Link to="/">Get back to main</Link></h2>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="text">404</div>
                </div>
            </div>
        </div>
    )
}

export default NotFound
