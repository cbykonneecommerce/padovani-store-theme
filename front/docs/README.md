# Store theme
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
Our MVP Basic theme to create stores in the VTEX IO platform by we.digi.

## First Steps

vtex install vtex.availability-notify vtex.reviews-and-ratings vtex.wordpress-integration vtex.wish-list vtex.checkout-ui-custom

## Preview
![store-theme-default](https://wedigi.vtexassets.com/assets/vtex.file-manager-graphql/images/0179df64-7fce-4e28-bdee-a55353e9fb1e___6b79f5f4058fa57a95f0cdee166aae7e.jpeg)

## Tutorial
To understand how things work check our tutorial [Build a store using VTEX IO](https://vtex.io/docs/getting-started/build-stores-with-store-framework/1/)

## Dependencies
All store components that you see on this document are open source too. Production ready, you can found those apps in this GitHub organization.

Store framework is the baseline to create any store using _VTEX IO Web Framework_.
- [Store](https://github.com/vtex-apps/store/blob/master/README.md)

Store GraphQL is a middleware to access all VTEX APIs.
- [Store GraphQL](https://github.com/vtex-apps/store-graphql/blob/master/docs/README.md)

### Store Component Apps
- [Header](https://github.com/vtex-apps/store-header/blob/master/docs/README.md)
- [Footer](https://github.com/vtex-apps/store-footer/blob/master/docs/README.md)
- [Slider Layout](https://github.com/vtex-apps/slider-layout/blob/master/docs/README.md)
- [Shelf](https://github.com/vtex-apps/shelf/blob/master/docs/README.md)
- [Telemarketing](https://github.com/vtex-apps/telemarketing/blob/master/docs/README.md)
- [Menu](https://github.com/vtex-apps/menu/blob/master/docs/README.md)
- [Login](https://github.com/vtex-apps/login/blob/master/docs/README.md)
- [Minicart](https://github.com/vtex-apps/minicart/blob/master/docs/README.md)
- [Category Menu](https://github.com/vtex-apps/category-menu/blob/master/docs/README.md)
- [Product Summary](https://github.com/vtex-apps/product-summary/blob/master/docs/README.md)
- [Breadcrumb](https://github.com/vtex-apps/breadcrumb/blob/master/docs/README.md)
- [Search Result](https://github.com/vtex-apps/search-result/blob/master/docs/README.md)
- [Product Details](https://github.com/vtex-apps/product-details/blob/master/docs/README.md)
- [Store Components](https://github.com/vtex-apps/store-components/blob/master/docs/README.md)
- [Order Placed](https://github.com/vtex-apps/order-placed/blob/master/docs/README.md) 

### Store Pixel Apps

 - [Facebook Pixel](https://github.com/vtex-apps/facebook-pixel/blob/master/docs/README.md)
 - [Google Tag Manager](https://github.com/vtex-apps/google-tag-manager/blob/master/docs/README.md)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.linkedin.com/in/luiz-henrique-santos-66b3822b/"><img src="https://media.licdn.com/dms/image/D4D03AQF-15VX1uIZRg/profile-displayphoto-shrink_400_400/0/1663642322055?e=1693440000&v=beta&t=O1NlP1znxxrt1JpYo35_PwJW6oIErvqIsl49F00K1OY" width="100px;" alt=""/><br /><sub><b>Luiz Henrique Santos</b></sub></a><br /><a href="https://github.com/wedigibrasil/mvp-basiccommits?author=lhmaster" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Alteração / tradução de textos

**Mutation**

    mutation Save($saveArgs: SaveArgsV2!) { 
	    saveV2(args: $saveArgs) 
	}
    
**Query**

	{ 
		"saveArgs": {
		    "to": "pt-BR",
		    "messages": [
			    {
			        "srcLang": "en-DV",
			        "srcMessage": "store/shipping.label",
			        "context": "vtex.availability-notify@1.x",
			        "targetMessage": "Calcular"
			    },
				{
			        "srcLang": "en-DV",
			        "srcMessage": "store/availability-notify.title",
			        "context": "vtex.availability-notify@1.x",
			        "targetMessage": "Produto Indisponível!"
          		},
				{
			        "srcLang": "en-DV",
			        "srcMessage": "store/availability-notify.notify-label",
			        "context": "vtex.availability-notify@1.x",
			        "targetMessage": "Quer ser notificado quando voltar ao estoque?"
			    },
				{
			        "srcLang": "en-DV",
			        "srcMessage": "store/minicart.go-to-checkout",
			        "context": "vtex.minicart@2.x",
			        "targetMessage": "Finalizar Pedido"
			    },
				{
			        "srcLang": "en-DV",
			        "srcMessage": "store/installments.default",
			        "context": "vtex.product-price@1.x",
			        "targetMessage": "Ou {installmentsNumber}x de {installmentValue}{hasInterest, select, true {, {interestRate} de juros} false { sem juros}}"
			    },
				{
			        "srcLang": "en-DV",
			        "srcMessage": "store/search-result.orderby.title",
			        "context": "vtex.search-result@3.x",
			        "targetMessage": "Ordenar"
			    },
				{
			        "srcLang": "en-DV",
			        "srcMessage": "store/shipping.label",
			        "context": "vtex.store-components@3.x",
			        "targetMessage": "Calcular"
			    }
		    ]
	    }
    }

