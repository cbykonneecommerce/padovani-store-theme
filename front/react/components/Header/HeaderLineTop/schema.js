export const schema = {
    title: 'Header Topo',
    type: 'object',
    properties: {
        linksArray:{
            title: 'Lista de Links',
            type: 'array',
            items:{
                type: 'object',
                properties:{
                    __editorItemTitle: {
                        title: 'Texto do Link',
                        type: 'string',
                        widget: {
                            'ui:widget': 'textarea',
                        },
                    },
                    url: {
                        title: 'URL do Link',
                        type: 'string'
                    },
                    target: {
                        title: 'Abre em nova aba?',
                        type: 'boolean',
                        default: false
                    },
                    iconArea: {
                        title: 'Icone',
                        type: 'object',
                        properties:{
                            icon: {
                                title: 'Icon',
                                type: 'string',
                                widget: {
                                    'ui:widget': 'image-uploader',
                                }, 
                            },
                        }
                    }
                }
            }
        },
        socialMedia:{
            title: 'Mídias Sociais',
            type: 'object',
            properties:{
                enableMedia:{
                    title: 'Exibe Mídias Sociais',
                    type: 'boolean',
                    default: true
                },
                text: {
                    title: 'Texto de midias sociais',
                    type: 'string',
                },
                medias:{
                    title: 'Lista de Midias Sociais',
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            __editorItemTitle:{
                                title: 'Nome da Midia Social',
                                type: 'string'
                            },
                            url:{
                                title: 'URL da Midia',
                                type: 'string',
                            },
                            icon:{
                                title: 'Icon',
                                type: 'string',
                                widget: {
                                    'ui:widget': 'image-uploader',
                                }, 
                            }
                        }
                    }
                }
            }
        }
    }
}