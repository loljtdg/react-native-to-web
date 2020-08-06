import * as React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { getRouteQuery } from '../utils/common'
import styled from 'styled-components/native'

export const StyledView = styled.View`
  background-color: papayawhip;
`

const Details = ({ route }: any) => {
  const { from } = getRouteQuery(route)

  return (
    <View style={styles.Container}>
      <Text>Details Screen from: {from}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default Details
