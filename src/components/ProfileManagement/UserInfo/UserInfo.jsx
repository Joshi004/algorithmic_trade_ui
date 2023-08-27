import React, { Component } from 'react';
import { Card, Image, List } from 'semantic-ui-react';
import './UserInfo.scss';
import 'semantic-ui-css/semantic.min.css'

class UserInfo extends Component {
    render() {
        const { userInfo } = this.props;
        console.log("These Are the props",userInfo)

        return (
            <div className='userInfoDiv'>
                <Card className="userInfo">
                <Image src={userInfo.avatar_url} wrapped ui={false} />
                <Card.Content>
                    <Card.Header>{userInfo.user_name}</Card.Header>
                    <Card.Meta>
                        <span className='date'>Token Valid Till 06:00 AM Tommorow</span>
                    </Card.Meta>
                    <Card.Description>
                        User ID: {userInfo.user_id}<br/>
                        Email: {userInfo.email}<br/>
                        User Type: {userInfo.user_type}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <List divided relaxed>
                        <List.Item>
                            <List.Header>Exchanges</List.Header>
                            {userInfo.exchanges.join(', ')}
                        </List.Item>
                        <List.Item>
                            <List.Header>Order Types</List.Header>
                            {userInfo.order_types.join(', ')}
                        </List.Item>
                        <List.Item>
                            <List.Header>Products</List.Header>
                            {userInfo.products.join(', ')}
                        </List.Item>
                    </List>
                </Card.Content>
            </Card>
            </div>
        );
    }
}

export default UserInfo;
