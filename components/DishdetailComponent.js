import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Button, Modal, Alert, PanResponder, Share } from 'react-native';
import { connect } from 'react-redux';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { imgUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => ({
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
});

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => { dispatch(postFavorite(dishId)) },
    postComment: (dishId, rating, author, comment) => { dispatch(postComment(dishId, rating, author, comment)) }
});

handleViewRef = (ref) => this.view = ref;

function RenderDish(props) {

    const dish = props.dish;
  
    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if (dx < -200)
            return true;
        else
            return false;
    }

    const recognizeRightSwipe = ({ moveX, moveY, dx, dy }) => {
        if (dx > 200)
            return true;
        else
            return false;
    }

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => {
            this.view.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));
        },
        onPanResponderEnd: (e, gestureState) => {
            if (recognizeDrag(gestureState))
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                        { text: 'OK', onPress: () => { props.favorite ? console.log('Already favorite') : props.onPress() } },
                    ],
                    { cancelable: false }
                );

            else if (recognizeRightSwipe(gestureState))
                props.toggleCommentModal();

            return true;
        }
    });

    const shareDish = (title, message, url) => {
        Share.share({
            title: title,
            message: title + ': ' + message + ' ' + url,
            url: url
        }, {
            dialogTitle: 'Share ' + title
        })
    }

    if (dish != null) {
        return (
            <Animatable.View animation="fadeInDown" duration={2000}
                ref={this.handleViewRef}
                {...panResponder.panHandlers} >
                <Card
                    featuredTitle={dish.name}
                    image={{ uri: imgUrl + dish.image }}>
                    <Text style={{ margin: 10 }}>
                        {dish.description}
                    </Text>
                    <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'center' }}>
                        <Icon
                            raised
                            reverse
                            name={props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                        />
                        <Icon
                            raised
                            reverse
                            name='pencil'
                            type='font-awesome'
                            color='#512DA8'
                            onPress={() => props.toggleCommentModal()}
                        />
                        <Icon
                            raised
                            reverse
                            name='share'
                            type='font-awesome'
                            color='#51D2A8'
                            onPress={() => shareDish(dish.name, dish.description, imgUrl + dish.image)} />
                    </View>
                </Card>
            </Animatable.View>
        );
    }
    else {
        return (<View></View>);
    }
}

function RenderComments(props) {

    const comments = props.comments;

    const renderCommentItem = ({ item, index }) => {

        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <Rating readonly
                    imageSize={12}
                    style={{ margin: 10, left: -110 }}
                    startingValue={item.rating}
                />
                <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + (new Date(item.date)).toLocaleString()} </Text>
            </View>
        );
    };

    return (
        <Animatable.View animation="fadeInUp" duration={2000}>
            <Card title='Comments' >
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    );
}


class Dishdetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rating: 5,
            author: '',
            comment: '',
            showCommentModal: false
        };
    }

    toggleCommentModal() {
        this.setState({
            rating: 5,
            author: '',
            comment: '',
            showCommentModal: !this.state.showCommentModal
        });

    }

    handleComment(dishId) {
        this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment);
        this.toggleCommentModal();
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    render() {
        const dishId = this.props.navigation.getParam('dishId', '');
        return (
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    toggleCommentModal={() => this.toggleCommentModal()}
                />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal animationType={"slide"} transparent={false}
                    visible={this.state.showCommentModal}
                    onDismiss={() => this.toggleCommentModal()}
                    onRequestClose={() => this.toggleCommentModal()}>
                    <View>
                        <Rating
                            style={{ margin: 20 }}
                            onFinishRating={(rating) => this.setState({ rating: rating })}
                            showRating
                            ratingCount={5}
                            startingValue={this.state.rating}
                        />
                        <Input
                            leftIcon={{ type: 'font-awesome', name: 'user-o', margin: 10 }}
                            placeholder="Author"
                            onChangeText={(text) => this.setState({ author: text })}
                        />
                        <Input
                            leftIcon={{ type: 'font-awesome', name: 'comment-o', margin: 10 }}
                            placeholder="Comment"
                            onChangeText={(text) => this.setState({ comment: text })}
                        />
                        <View style={{ margin: 20, marginBottom: 0 }}>
                            <Button
                                onPress={() => this.handleComment(dishId)}
                                color="#512DA8"
                                title="Submit"
                            />
                        </View>
                        <View style={{ margin: 20 }}>
                            <Button
                                onPress={() => this.toggleCommentModal()}
                                color="#9C9594"
                                title="Close"
                            />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);