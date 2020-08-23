import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { Tile } from 'react-native-elements';
import { imgUrl } from '../shared/baseUrl';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => ({
    dishes: state.dishes
})

class Menu extends Component {

    static navigationOptions = {
        title: 'Menu'
    };

    render() {
        const { navigate } = this.props.navigation;

        const renderMenuItem = ({ item, index }) => {
            return (
                <Tile
                    key={index}
                    title={item.name}
                    caption={item.description}
                    featured
                    onPress={() => navigate('Dishdetail', { dishId: item.id })}
                    imageSrc={{ uri: imgUrl + item.image }}
                />
            );
        };

        if (this.props.dishes.isLoading) {
            return (
                <Loading />
            );
        }
        else if (this.props.dishes.errMess) {
            return (
                <View>
                    <Text>{props.dishes.errMess}</Text>
                </View>
            );
        }
        else return (
            <Animatable.View animation="fadeInRightBig" duration={2000}>
                <FlatList
                    data={this.props.dishes.dishes}
                    renderItem={renderMenuItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Animatable.View>
        );
    }
}


export default connect(mapStateToProps)(Menu);