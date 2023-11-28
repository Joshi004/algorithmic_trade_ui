import React from 'react';
import { Button, Input, Loader } from 'semantic-ui-react'; // Import Loader from semantic-ui-react
import './ProfileManagement.scss';
import { useNavigate } from 'react-router-dom';
import UserInfo from './UserInfo/UserInfo';

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
        console.log("Componet Did MOunt")
        const { location } = this.props;
        const query = new URLSearchParams(location.search);
        const request_token = query.get('request_token');
        if(request_token){
            this.setSession(request_token)
        }
        this.getProfileInfo()
    }

    getProfileInfo = () => {
        this.setState({ isLoading: true }); // Start loading before API call
        fetch('http://127.0.0.1:8000/tmu/get_profile_info')
            .then(response => response.json())
            .then(data => this.setState({ userInfo: data, isLoading: false })) // Stop loading after API call
            .catch(error => {
                console.error('Error:', error);
                this.setState({ isLoading: false }); // Stop loading if there is an error
            });
    }


    handleInputChange = (event) => {
        this.setState({
            token: event.target.value,
        });
    };

    setSession = (request_token) => {
        console.log("Setting Session")
        fetch('http://127.0.0.1:8000/tmu/set_session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ request_token: request_token}),
        })
        .then(response => response.json())
        .then(data => {
            this.setState({ setSession: true, userInfo : data },()=>{
                console.log("Set Sesion Done",data)
                this.props.navigate(this.props.location.pathname, { replace: true })
            });
        })
        .catch((error) => {
            console.error('Error:', error);
            this.setState({ setSession: false },()=>{
                this.props.navigate(this.props.location.pathname, { replace: true })
            });
        });
    };

    setNewSession = () => {
        fetch('http://127.0.0.1:8000/tmu/get_login_url')
        .then(response => response.json())
        .then(data => {
            if (data.login_url && this.isValidUrl(data.login_url)) {
                window.location.href = data.login_url;
                this.setState({ urlResponse: 'URL opened in a new tab.' });
            } else {
                this.setState({ urlResponse: 'Invalid URL received.' });
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            this.setState({ urlResponse: 'Error occurred while making the API call.' });
        });
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
                    <UserInfo userInfo = {this.state.userInfo}></UserInfo>
                ) : (
                    <p>You need to log in to continue.</p> // Show message when user is not logged in
                )}
            </div>
        );
    }
}

export default ProfileManagement;
