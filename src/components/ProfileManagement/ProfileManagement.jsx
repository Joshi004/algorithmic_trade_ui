import React from 'react';
import { Button, Input } from 'semantic-ui-react';
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
            userInfo : {}
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
        fetch('http://127.0.0.1:8000/tmu/get_profile_info')
            .then(response => response.json())
            .then(data => this.setState({ userInfo: data }))
            .catch(error => console.error('Error:', error));
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
                {this.state.userInfo.email ? <UserInfo userInfo = {this.state.userInfo}></UserInfo> : null}
            </div>
        );
    }
}

export default ProfileManagement;
