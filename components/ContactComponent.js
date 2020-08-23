import React from 'react';
import { Card, Button, Icon } from 'react-native-elements';
import { Text } from 'react-native';
import * as MailComposer from 'expo-mail-composer';
import * as Animatable from 'react-native-animatable';

class Contact extends React.Component {

    static navigationOptions = {
        title: 'Contact Us'
    };

    sendMail() {
        MailComposer.composeAsync({
            recipients: ['confusion@food.net'],
            subject: 'Enquiry',
            body: 'To whom it may concern:'
        })
    }

    render() {
        return (
            <Animatable.View animation="fadeInDown" duration={2000}>
                <Card title="Contact Information" titleStyle={{ fontSize: 18 }}>
                    <Text>121, Clear Water Bay Road</Text>
                    <Text>Clear Water Bay, Kowloon</Text>
                    <Text>HONG KONG</Text>
                    <Text>Tel: +852 1234 5678</Text>
                    <Text>Fax: +852 8765 4321</Text>
                    <Text>Email:confusion@food.net</Text>
                </Card>
                <Button
                    title="Send Email"
                    buttonStyle={{ backgroundColor: "#512DA8" }}
                    containerStyle={{ margin: 10 }}
                    titleStyle={{ margin: 10 }}
                    icon={<Icon name='envelope-o' type='font-awesome' color='white' />}
                    onPress={this.sendMail}
                />
            </Animatable.View>
        );
    }
}

export default Contact;