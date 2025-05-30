import './ProfileManagement.scss';

import { Button, Input, Loader } from 'semantic-ui-react'; // Import Loader from semantic-ui-react

import ENDPOINTS from '../../services/endpoints';
import React from 'react';
import UserInfo from './UserInfo/UserInfo';
import apiService from '../../services/apiService';
import { useNavigate } from 'react-router-dom';

class ProfileManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            setSession: null,
            urlResponse: null,
            userInfo : {},
            isLoading: false // Add isLoading state to control the loader
        };
    }

    componentDidMount() {
        const { location } = this.props;
        const query = new URLSearchParams(location.search);
        const request_token = query.get('request_token');
        if(request_token){
            this.setSession(request_token)
        }
        this.getProfileInfo()
    }

    getProfileInfo = async () => {
        this.setState({ isLoading: true }); // Start loading before API call
        try {
            const data = await apiService.get(ENDPOINTS.KITE.GET_PROFILE_INFO);
            this.setState({ userInfo: data, isLoading: false }); // Stop loading after API call
        } catch (error) {
            console.error('Error:', error);
            this.setState({ isLoading: false }); // Stop loading if there is an error
        }
    }

    handleInputChange = (event) => {
        this.setState({
            token: event.target.value,
        });
    };

    setSession = async (request_token) => {
        console.log("Setting Session");
        try {
            const data = await apiService.post(ENDPOINTS.KITE.SET_SESSION, { request_token });
            this.setState({ setSession: true, userInfo: data }, () => {
                this.props.navigate(this.props.location.pathname, { replace: true });
            });
        } catch (error) {
            console.error('Error:', error);
            this.setState({ setSession: false }, () => {
                this.props.navigate(this.props.location.pathname, { replace: true });
            });
        }
    };

    setNewSession = async () => {
        try {
            const data = await apiService.get(ENDPOINTS.KITE.GET_LOGIN_URL);
            if (data.login_url && this.isValidUrl(data.login_url)) {
                window.location.href = data.login_url;
                this.setState({ urlResponse: 'URL opened in a new tab.' });
            } else {
                this.setState({ urlResponse: 'Invalid URL received.' });
            }
        } catch (error) {
            console.error('Error:', error);
            this.setState({ urlResponse: 'Error occurred while making the API call.' });
        }
    };

    isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;  
        }
    };

    render() {
        return (
            <div className="profile-management">
                <Button onClick={this.setNewSession}>Set New Session</Button>
                {this.state.isLoading ? (
                    <Loader active inline='centered' /> // Show loader when isLoading is true
                ) : this.state.userInfo.email ? (
                    <UserInfo userInfo={this.state.userInfo}></UserInfo>
                ) : (
                    <p>You need to log in to continue.</p> // Show message when user is not logged in
                )}
            </div>
        );
    }
}

export default ProfileManagement;
