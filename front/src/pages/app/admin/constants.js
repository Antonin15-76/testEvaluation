// import { constructInput as constructPhoneBrandInput } from '../phoneBrand/constants'
export const pageSize = 50

export const constructVariables = (values, otherVariables) => {
  return Object.assign({}, { accountId: values.supplier, userAgencyId: values.userAgencyId }, otherVariables)
}
