import React, { useLayoutEffect, useState, } from "react"

import Banner from "./Menu/Banner"
import Column from "./Menu/Column"
import HeaderMenu from "./Menu/Header"

import { useCssHandles } from 'vtex.css-handles'
import "../../../styles/css/header.menu.css"

import { useApolloClient } from 'react-apollo'
import getBrands from "./queries/brands.gql"
import getCategories from "./queries/categories.gql"

const Menu = ({ ...props }) => {

	const windowWidth = window && window?.innerWidth < props.breakpoint
	const path = window && window?.location?.pathname

	const [ title, setTitle ] = useState(null)
	const [ current, setCurrent ] = useState(null)
	const [ categories, setCategories ] = useState(null)
	const [ brands, setBrands ] = useState(null)

	const [ level, setLevel ] = useState(1)
	const [ currentLevel, setCurrentLevel ] = useState(null)

	const client = useApolloClient();

	useLayoutEffect(()=> {
		if(categories == null) {
			client.query({
				query: getCategories
			}).then(response => {
				let sortCategories = response.data.categories.sort((a, b) => a.name.localeCompare(b.name));
				setCategories(sortCategories)                    
			})
		}

		if(brands == null) {
			client.query({
				query: getBrands
			}).then(response => {
				
				const groupedItems = {};

				response.data.brands.map(item => {
					const initial = item.name.charAt(0).toUpperCase();
					if (groupedItems[initial]) {
						groupedItems[initial].push(item);
					} else {
						groupedItems[initial] = [item];
					}
				});

				const groupedArray = Object.keys(groupedItems).map(key => ({
					initial: key,
					items: groupedItems[key]
				}));

				let groupedArraySort = groupedArray.sort((a, b) => {
					if (a.initial < b.initial) {
					  return -1;
					}
					if (a.initial > b.initial) {
					  return 1;
					}
					return 0;
				  });

				setBrands(groupedArraySort)                    
			})
		}
	})

	const CSS_HANDLES = ['menuContainerNav', 'menuContainer', 'full', 'mainItem', 'iconMainMenu', 'wrapperItem', 'currentPage', 'active', 'emphasis', 'hasChildren', 'mainItemLink', 'mainSubMenuWrapper', 'cortina', 'backButton', 'open', 'icon', 'columBrands', 'brandList', 'brandItem', 'brandLink', 'brandsSubMenuWrapper', 'brandScroll']
	const  { handles }  =  useCssHandles ( CSS_HANDLES )

	if(props.menu == undefined) return null

	const openMenu = (url, name) => {
		setCurrent(current != url ? url : null); 
		setTitle(current != url ?  {...title, [level]: name } : null);
		setCurrentLevel(level)
	}

	let lastItens = props.menu.length - (props.lastItems ? props.lastItems : 2)

    return ( 
		<nav data-level={currentLevel ? currentLevel : 0} className={`${handles.menuContainerNav} ${handles[props.blockClass]} ${ props.full ? handles.full : "" } ${ windowWidth && handles[props.template] }`}>
			{ windowWidth && <HeaderMenu title={title ? title[currentLevel] : props.initialTitle} /> }
			<ul className={`${handles.menuContainer}`}>
				{
					props.menu.map((menu, key) => {
						return(
							<li key={key} data-level={level} className={`${handles.mainItem} ${path == menu.url && handles.currentPage} ${current == menu.url && handles.active} ${menu.emphasis && handles.emphasis} ${menu?.column?.length > 0 && handles.hasChildren}`} data-last={ key >= lastItens && "true" } data-name={menu.__editorItemTitle}>
								<div className={handles.wrapperItem}>
									<a href={menu.url} className={handles.mainItemLink} target={menu.target ? "_blank" : "_self"} style={{backgroundColor: menu.emphasisBackground, color: menu.emphasisColor}}>
										{ menu?.icon?.image && menu?.icon?.image != "" && <img className={handles.iconMainMenu} src={menu?.icon?.image} alt={menu.__editorItemTitle} />}
										<span>{ menu.__editorItemTitle }</span>
									</a>
									{ windowWidth && menu?.column?.length > 0 && <button className={handles.open} onClick={ ()=> { openMenu( menu.url, menu.__editorItemTitle); }}><img className={handles.icon} src={ current == menu.url ? props.iconMinus : props.iconPlus } alt={ menu.__editorItemTitle }  /></button> }
									{ windowWidth && menu.isBrands && <button className={handles.open} onClick={ ()=> { openMenu( menu.url, menu.__editorItemTitle); }}><img className={handles.icon} src={ current == menu.url ? props.iconMinus : props.iconPlus } alt={ menu.__editorItemTitle }  /></button> }
								</div>
								{
									brands && menu.isBrands ?
										<div className={`${handles.mainSubMenuWrapper} ${handles.brandsSubMenuWrapper}`}>
											{ windowWidth && current == menu.url && props.template == "cortina" && <button className={handles.backButton} onClick={ ()=> { setCurrent(null); setTitle(null); setCurrentLevel(null);  }}><img src={props.iconBack} alt="Voltar"  /></button> }
											<div className={handles.brandScroll}>
												{
													brands.map(group => (
														<div key={group.initial} className={handles.columBrands}>
															<strong>{group.initial}</strong>
															<ul className={handles.brandList}>
																{
																	group.items.map(item => (
																		<li key={item.slug} className={handles.brandItem}>
																			<a href={`/${item.slug}`} className={handles.brandLink}>{item.name}</a>
																		</li>
																	))
																}
															</ul>
														</div>
													))
												}
											</div>
										</div>
									:
										menu?.column?.length > 0 &&
											<div className={handles.mainSubMenuWrapper}>
												{ windowWidth && current == menu.url && props.template == "cortina" && <button className={handles.backButton} onClick={ ()=> { setCurrent(null); setTitle(null); setCurrentLevel(null);  }}><img src={props.iconBack} alt="Voltar"  /></button> }
												{
													menu?.column?.map((column, key2) => (
														<Column  key={key2} column={column} categories={categories} config={props} title={title} setTitle={setTitle} level={level} setCurrentLevel={setCurrentLevel} />
													))
												}
												{ !windowWidth && <Banner banners={menu.banners} /> }
											</div>
								}
							</li>
						)
					})
				}
			</ul>
		</nav>
    )

}

Menu.schema = {
    title: 'Menu - we.digi',
    type: 'object',
    properties: {	
        menu: {
            title: 'Menu',
            type: 'array',
            items: {
                title: "Item",
                type: 'object',
                properties: {
					__editorItemTitle: {                                     
						type: 'string',
						title: 'Título'
					},
                    url: {
                        title: "URL",
                        type: 'string',
                        default: "#"
                    },
                    external: {
                        title: "Link é externo?",
                        type: 'boolean',
                        widget: {
                          "ui:widget": "checkbox"
                        }
                    },
					emphasis: {
                        title: "Destaque",
                        type: 'boolean',
                        widget: {
                          "ui:widget": "checkbox"
                        },
						default: false
                    },
					emphasisBackground: {
                        title: "Cor do Fundo Destaque",
                        type: 'string',
                        widget: {
                          "ui:widget": "color"
                        }
                    },
					emphasisColor: {
                        title: "Cor do texto em Destaque",
                        type: 'string',
                        widget: {
                          "ui:widget": "color"
                        }
                    },
					icon: {
						title: "Item",
						type: 'object',
						properties: {
							image: {
								title: "Icone",
								type: 'string',
								widget: {
									'ui:widget': 'image-uploader',
								},
							}
						}
                    },
					column: {
						title: 'Colunas',
						type: 'array',
						items: {
							title: "Item",
							type: 'object',
							properties: {
								allCategories: {
									title: "Exibir todas as categorias?",
									type: 'boolean',
									widget: {
									  "ui:widget": "checkbox"
									}
								},
								__editorItemTitle: {                                     
									type: 'string',
									title: 'Título'
								},
								showTitle: {
									title: "Mostrar título",
									type: 'boolean',
									widget: {
									  "ui:widget": "checkbox"
									}
								},
								isCategory: {
									title: "É por id de categoria?",
									type: 'boolean',
									widget: {
									  "ui:widget": "checkbox"
									}
								},
								url: {
									title: "URL ou ID",
									description: "Seguindo referência do campo acima, só habilite o campo abaixo para ID de categoria.",
									type: 'string',
									default: "#"
								},
								hasChildren: {
									title: "Carrega categorias dinamicamente?",
									description: "Monta árvore de categoria baseada no ID da categoria principal.",
									type: 'boolean',
									widget: {
									  "ui:widget": "checkbox"
									},
									default: false
								},
								external: {
									title: "Link é externo?",
									type: 'boolean',
									widget: {
									  "ui:widget": "checkbox"
									}
								},
								submenu: {
									title: 'Subcategoria',
									type: 'array',
									items: {
										title: "Item",
										type: 'object',
										properties: {
											__editorItemTitle: {                                     
												type: 'string',
												title: 'Título'
											},
											icon: {
												title: "Icone",
												type: 'string',
												widget: {
													'ui:widget': 'image-uploader',
												},
											},
											isCategory: {
												title: "É por id de categoria?",
												type: 'boolean',
												widget: {
												  "ui:widget": "checkbox"
												}
											},
											url: {
												title: "URL ou ID",
												description: "Seguindo referência do campo acima, só habilite o campo abaixo para ID de categoria.",
												type: 'string',
												default: "#"
											},
											hasChildren: {
												title: "Carrega categorias dinamicamente?",
												description: "Monta árvore de categoria baseada no ID da categoria principal.",
												type: 'boolean',
												widget: {
												  "ui:widget": "checkbox"
												},
												default: false
											},
											external: {
												title: "Link é externo?",
												type: 'boolean',
												widget: {
												  "ui:widget": "checkbox"
												}
											},
											submenu: {
												title: 'Subcategoria',
												type: 'array',
												items: {
													title: "Item",
													type: 'object',
													properties: {
														__editorItemTitle: {                                     
															type: 'string',
															title: 'Título'
														},
														isCategory: {
															title: "É por id de categoria?",
															type: 'boolean',
															widget: {
															  "ui:widget": "checkbox"
															}
														},
														url: {
															title: "URL ou ID",
															description: "Seguindo referência do campo acima, só habilite o campo abaixo para ID de categoria.",
															type: 'string',
															default: "#"
														},
														hasChildren: {
															title: "Carrega categorias dinamicamente?",
															description: "Monta árvore de categoria baseada no ID da categoria principal.",
															type: 'boolean',
															widget: {
															  "ui:widget": "checkbox"
															},
															default: false
														},
														external: {
															title: "Link é externo?",
															type: 'boolean',
															widget: {
															  "ui:widget": "checkbox"
															}
														},
														submenu: {
															title: 'Subcategoria',
															type: 'array',
															items: {
																title: "Item",
																type: 'object',
																properties: {
																	__editorItemTitle: {                                     
																		type: 'string',
																		title: 'Título'
																	},
																	isCategory: {
																		title: "É por id de categoria?",
																		type: 'boolean',
																		widget: {
																		  "ui:widget": "checkbox"
																		}
																	},
																	url: {
																		title: "URL ou ID",
																		description: "Seguindo referência do campo acima, só habilite o campo abaixo para ID de categoria.",
																		type: 'string',
																		default: "#"
																	},
																	hasChildren: {
																		title: "Carrega categorias dinamicamente?",
																		description: "Monta árvore de categoria baseada no ID da categoria principal.",
																		type: 'boolean',
																		widget: {
																		  "ui:widget": "checkbox"
																		},
																		default: false
																	},
																	external: {
																		title: "Link é externo?",
																		type: 'boolean',
																		widget: {
																		  "ui:widget": "checkbox"
																		}
																	},
																},
															},
														},
													},
												},
											},
										},
									},
								},
							},
					
						},
					},
					isBrands: {
                        title: "Carregar todas as marcas?",
                        type: 'boolean',
                        widget: {
                          "ui:widget": "checkbox"
                        },
						default: false
                    },
					banners: {
						title: 'Banners',
						type: 'array',
						items: {
							title: "Banner",
							type: 'object',
							properties: {
								title: {
									title: "Título para SEO",
									type: 'string',
									default: ""
								},	
								showLabel: {
									title: "Mostrar título",
									type: 'boolean',
									widget: {
										"ui:widget": "checkbox"
									},
									default: false
								},
								banner: {
									title: "Banner Principal",
									type: 'string',
									widget: {
										'ui:widget': 'image-uploader',
									},
								},	
								url: {
									title: "Link do Banner",
									type: 'string',
									default: ""
								},	
								external: {
									title: "Link é externo?",
									type: 'boolean',
									widget: {
									  "ui:widget": "checkbox"
									}
								},
							},
						},
					},
                },
            },
        },
		template: {
			title: "Template",
			type: 'string',
			enum: [
				"default",
				"cortina"
			],
			widget: {
				"ui:widget": "select"
			},
			default: "default"
		},
		full: {
			title: "Largura completa?",
			type: 'boolean',
			widget: {
				"ui:widget": "checkbox"
			},
			default: false
		},
		initialTitle: {                                     
			type: 'string',
			title: 'Título Inicial no mobile'
		},
		breakpoint: {                                     
			type: 'number',
			title: 'Breakpoint para mobile',
			default: 1024
		},
		iconPlus: {
			title: "Icone Abrir",
			type: 'string',
			widget: {
				'ui:widget': 'image-uploader',
			},
		},
		iconMinus: {
			title: "Icone Fechar",
			type: 'string',
			widget: {
				'ui:widget': 'image-uploader',
			},
		},
		iconBack: {
			title: "Icone Voltar",
			type: 'string',
			widget: {
				'ui:widget': 'image-uploader',
			},
		},
    },
}

export default Menu;