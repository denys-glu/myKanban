import React, {useEffect, useStaet} from 'react';
import axios from 'axios';
import {Navigate} from '@reach/router';


function Register(props) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function onSubmitHandler(e) => {
        
    }
}