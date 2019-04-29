import React from 'react'
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Clipboard,
  Button,
  Image,
  ActivityIndicator,
  StatusBar,
} from 'react-native'


import LinkedInModal from 'react-native-linkedin'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userContainer: {
    padding: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  picture: {
    width: 200,
    height: 200,
    borderRadius: 100,
    resizeMode: 'cover',
    marginBottom: 15,
  },
  item: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  label: {
    marginRight: 10,
  },
  value: {
    fontWeight: 'bold',
    marginLeft: 10,
  },
  linkedInContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {
    flex: 0.7,
    alignItems: 'flex-end',
  },
  valueContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
})

export default class AppContainer extends React.Component {
  state = {
    access_token: undefined,
    expires_in: undefined,
    refreshing: false,
  }

  constructor(props) {
    super(props)
    StatusBar.setHidden(true)
  }

  async getUser({ access_token }) {
    // this.setState({ refreshing: true })
    const baseApi = 'https://api.linkedin.com/v2/me/'
    const qs = { format: 'json' }
    const params = [
      'first-name',
      'last-name',
      'picture-urls::(original)',
      'headline',
      'email-address',
    ]

    // const response = await fetch(`${baseApi}~:(${params.join(',')})?format=json`, {
    const response = await fetch(`${baseApi}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + access_token,
      },
    })
    const payload = await response.json()
    this.setState({ ...payload, refreshing: false })
  }

  renderItem(label, value) {
    return (
      <View style={styles.item}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
        </View>
        <Text>👉</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
        </View>
      </View>
    )
  }

  render() {
    const { emailAddress, pictureUrls, refreshing, firstName, lastName, headline } = this.state
    return (
      <View style={styles.container}>
        <Text>Token {this.state.access_token}</Text>
        {!emailAddress &&
          !refreshing && (
            <View style={styles.linkedInContainer}>
              <LinkedInModal
                ref={ref => {
                  this.modal = ref
                }}
                clientID="81r5i9o94dw6pv"
                clientSecret="lTUhkvejbMRvtIuK"
                redirectUri="http://www.pratian.com"
                onSuccess={data => this.setState({ access_token: data.access_token })}
              />
              <Button title="Open from external" onPress={() => this.modal.open()} />
            </View>
          )}

        {refreshing && <ActivityIndicator size="large" />}

        {emailAddress && (
          <View style={styles.userContainer}>
            <Image style={styles.picture} source={{ uri: pictureUrls.values[0] }} />
            {this.renderItem('Email', emailAddress)}
            {this.renderItem('First name', firstName)}
            {this.renderItem('Last name', lastName)}
            {this.renderItem('Headline', headline)}
          </View>
        )}
      </View>
    )
  }
}