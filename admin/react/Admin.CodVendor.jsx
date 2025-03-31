import React, { useState, useEffect } from 'react'
import { FormattedDate, FormattedMessage, FormattedTime } from 'react-intl'
import { FormattedPrice } from 'vtex.formatted-price'

import {
    Layout,
    PageBlock,
    PageHeader,
    Table,
    Dropdown,
    Button,
    DatePicker
} from 'vtex.styleguide'


export function addDotBeforeLastTwoChars(inputString) {
    if(inputString) {
        // Check if the input string is at least two characters long
        if (inputString.length < 2) {
            return inputString; // No change needed if the string is too short
        }

        // Get the part of the string except for the last two characters
        const prefix = inputString.slice(0, -2);

        // Get the last two characters
        const lastTwoChars = inputString.slice(-2);

        // Combine them with a dot in between
        const resultString = prefix + '.' + lastTwoChars;

        return parseFloat(resultString);
    }
}

const CodVendor = () => {

    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [orders, setOrders ] = useState()
    const [filteredOrders, setFilteredOrders] = useState([])

    const [listCod, setListCod ] = useState()
    const [listCodSelected, setListCodSelected ] = useState({ label: null, value: null })

    const handleDatePicker = (date, type) => {
        const day = String(date.getDate()).padStart(2, '0'); 
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        if(type === 'start') {
            setStartDate(() => new Date(`${month}-${day}-${year} 00:00:00`))

        } else {
            setEndDate(() => new Date(`${month}-${day}-${year} 23:59:59`))
        }
    }


    const searchOrders = () => {
        fetch(`/api/dataentities/PV/search?_fields=id,order,createdIn,sellerCode`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'REST-Range': `resources=0-99`
            }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
             
            return response.json();
          })
          .then(data => {

            const sortedData = data.sort((a, b) => {
                const dateA = new Date(a.order.creationDate);
                const dateB = new Date(b.order.creationDate);
                return dateA - dateB;
            });

            const uniqueSellers = data.filter((item, index, self) =>
                index === self.findIndex((t) => (
                    t.sellerCode === item.sellerCode
                ))
            );

            const newData = uniqueSellers.map((item) => {
                return ({value: item.sellerCode, label: item.sellerCode})
            })

            setOrders(sortedData)
            setFilteredOrders(sortedData)
            setListCod(newData)
          })
          .catch(error => {
            console.error("Error", error);
            throw error; 
        });
    }

    const handleSearch = () => {
        if (orders) {
            let filteredItems = orders.filter(item => {
                const creationDate = new Date(item.order.creationDate);

                return creationDate >= startDate && creationDate <= endDate ? true : false
            });
            
            if (listCodSelected.value) {
                filteredItems = filteredItems.filter(item => listCodSelected.value == item.sellerCode);
            }
    
            const sortedData = filteredItems.sort((a, b) => {
                const dateA = new Date(a.order.creationDate);
                const dateB = new Date(b.order.creationDate);
                return dateA - dateB;
            });
    
            setFilteredOrders(sortedData);
        }
    }

    const tableOrdersSchema = {
        properties: {
            id: {
                title: 'Id',
                sortable: true,
            },
            sellerCode: {
                title: 'Código Vendedor',
                sortable: true,
            },
            createdIn: {
                title: 'Data Pedido',
                sortable: true,
                cellRenderer: ({ cellData, rowData }) => {
                    return(
                        <>
                            <FormattedDate value={rowData.order.creationDate} />&nbsp;
                            <FormattedTime value={rowData.order.creationDate} />
                        </>
                    )
                }
            },
            order: {
                title: "Total",
                sortable: true,
                cellRenderer: ({ cellData }) => {
                    return(
                        <FormattedPrice value={addDotBeforeLastTwoChars(cellData.value.toString())} />
                    )
                }
            },
            actions: {
                title: "Ações",
                cellRenderer: ({rowData}) => {
                    return(
                        <Button variation="secondary" onClick={() => { window.open(`/admin/orders/${rowData.order.orderId}`, `Pedido - ${rowData.order.orderId}`); }} size="small">Detalhes</Button>
                    )
                }
            }
        }
    }

    let filterOrders = filteredOrders

    const totalValue = filterOrders?.reduce((accumulator, currentOrder) => {
        if (currentOrder.order && currentOrder.order.value) {
          return accumulator + currentOrder.order.value;
        } else {
          return accumulator;
        }
    }, 0);

    useEffect(() => {
        setStartDate(() => new Date(thirtyDaysAgo.setDate(currentDate.getDate() - 30)));
        setEndDate(() => new Date())
        searchOrders()
    },[])

    return(
        <Layout
            pageHeader={
                <PageHeader
                    title={<FormattedMessage id="admin/list.title" />}
                />
            }
        >
            <PageBlock variation="full">
                <div className="flex column-gap-4">
                    <div className="mr4 w-60">
                        <Dropdown
                            label="Código do Vendedor"
                            size="small"
                            options={listCod}
                            value={listCodSelected.value}
                            onChange={(_, v) => setListCodSelected({ label: v, value: v })}
                        />
                    </div>
                    <div className="mr4 w-30">
                        <DatePicker
                            label="Data inicial"
                            size="small"
                            value={startDate}
                            onChange={date => handleDatePicker(date, 'start')}
                            locale="pt-BR"
                        />
                    </div>
                    <div className="mr4 w-30">
                        <DatePicker
                            label="Data Final"
                            size="small"
                            value={endDate}
                            onChange={date => handleDatePicker(date, 'end')}
                            locale="pt-BR"
                        />
                    </div>
                    <div className="w-30 flex items-end">
                        <Button variation="primary" size="small" block onClick={handleSearch}>Buscar</Button>
                    </div>
                </div>
                <div style={{ marginTop: 20 }}>
                    <Table
                        fullWidth
                        items={filteredOrders}
                        schema={tableOrdersSchema}
                        density="low"
                        emptyStateLabel={<FormattedMessage id="admin/list.table.empty" />}
                        totalizers={[
                            {
                                label: 'Quantidade Pedidos',
                                value: filteredOrders?.length
                            },
                            {
                            label: 'Total',
                            value: <FormattedPrice value={addDotBeforeLastTwoChars(totalValue?.toString())} />
                            }
                        ]}
                    />
                </div>
            </PageBlock>
        </Layout>
    )
}

export default CodVendor