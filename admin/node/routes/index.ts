import { method } from '@vtex/api'

import { masterdataValidate } from '../middlewares/masterdataValidate'

import { saveOrders } from '../clients/saveOrders'

export const routes = {
    saveOrders: method({
        POST: [masterdataValidate, saveOrders],
    })
}