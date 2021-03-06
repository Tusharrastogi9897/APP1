import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Picker, Switch, Button, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Input } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as Animatable from 'react-native-animatable';
import * as Calendar from 'expo-calendar';
import { Notifications } from 'expo';

class Reservation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            guests: 1,
            smoking: false,
            date: '',
            isModalOpen: false
        }
    }

    static navigationOptions = {
        title: 'Reserve Table',
    };

    handleReservation() {
        console.log(JSON.stringify(this.state));
        Alert.alert('Your Reservation OK?',
            'Number Of Guests: ' + this.state.guests.toString() + '\nSmoking? ' + this.state.smoking + '\nDate And Time: ' + (new Date(this.state.date)).toLocaleString(),
            [{
                text: 'Cancel', onPress: () => this.resetForm(), style: 'cancel'
            },
                {
                    text: 'OK', onPress: () => { this.presentLocalNotification(this.state.date); this.addReservationToCalendar(this.state.date); this.resetForm(); }
            }],
            { cancelable: false });
    }

    toggleDateTimeModal() {
        this.setState({ isModalOpen: !this.state.isModalOpen });
    }

    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            date: '',
            isModalOpen: false
        });
    }

    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS); if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
        }
        return permission;
    }

    async presentLocalNotification(date) {
        await this.obtainNotificationPermission();
        Notifications.presentLocalNotificationAsync({
            title: 'Your Reservation',
            body: 'Reservation for ' + (new Date(date)).toLocaleString() + ' requested',
            ios: {
                sound: true
            },
            android: {
                sound: true,
                vibrate: true,
                color: '#512DA8'
            }
        });
    }

    async obtainCalendarPermission() {
        let permission = await Permissions.getAsync(Permissions.CALENDAR);
        permission = await Permissions.askAsync(Permissions.CALENDAR);

        if (permission.status !== 'granted') {
            Alert.alert('Permission not granted to configure Calendar');
        }
        return permission;
    }

    async addReservationToCalendar(data) {
        await this.obtainCalendarPermission();
        const calendar = await Calendar.createCalendarAsync({
            title: 'Expo Calendar',
            color: 'white',
            source: { isLocalAccount: true, name: 'Expo Calendar' },
            name: 'internalCalendarName',
            ownerAccount: 'Local Calendar',
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
        });
        date = new Date(Date.parse(data));
        date.setMilliseconds(date.getMilliseconds() + 2 * 60 * 60 * 1000);
        Calendar.createEventAsync(calendar, {
            title: 'Con Fusion Table Reservation',
            startDate: new Date(Date.parse(data)),
            endDate: date,
            timeZone: 'Asia/Hong_Kong',
            location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'
        });
    }

    render() {
        return (
            <ScrollView>
                <Animatable.View animation="zoomIn" duration={2000}>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Number of Guests</Text>
                        <Picker
                            style={styles.formItem}
                            selectedValue={this.state.guests}
                            onValueChange={(itemValue, itemIndex) => this.setState({ guests: itemValue })}>
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="5" value="5" />
                            <Picker.Item label="6" value="6" />
                        </Picker>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
                        <Switch
                            style={styles.formItem}
                            value={this.state.smoking}
                            onTintColor='#512DA8'
                            onValueChange={(value) => this.setState({ smoking: value })}>
                        </Switch>
                    </View>
                    <View style={styles.formRow}>
                        <Input
                            placeholder="Select Date And Time"
                            placeholderTextColor="black"
                            leftIcon={{ type: 'font-awesome', name: 'calendar', size: 22, margin: 10 }}
                            value={this.state.date}
                            onTouchStart={() => { this.toggleDateTimeModal() }}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Button
                            onPress={() => this.handleReservation()}
                            title="Reserve"
                            color="#512DA8"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    <DateTimePickerModal
                        mode="datetime"
                        minimumDate={new Date().getDate()}
                        isVisible={this.state.isModalOpen}
                        onConfirm={(date) => this.setState({ date: date.toISOString() })}
                    />
                </Animatable.View>
            </ScrollView>
        );
    }

};

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});

export default Reservation;