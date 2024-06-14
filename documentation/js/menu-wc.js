'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">squadme-angular documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AboutPageModule.html" data-type="entity-link" >AboutPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AboutPageModule-dc14a33ffcc9e24195161ebdec504f13b97f1f0198fe32fdbc513a76d9f0aacc59de93d2869bf16149a2f8e893ac3c17176f25360d2684ed0b8628eec507b3bb"' : 'data-bs-target="#xs-components-links-module-AboutPageModule-dc14a33ffcc9e24195161ebdec504f13b97f1f0198fe32fdbc513a76d9f0aacc59de93d2869bf16149a2f8e893ac3c17176f25360d2684ed0b8628eec507b3bb"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AboutPageModule-dc14a33ffcc9e24195161ebdec504f13b97f1f0198fe32fdbc513a76d9f0aacc59de93d2869bf16149a2f8e893ac3c17176f25360d2684ed0b8628eec507b3bb"' :
                                            'id="xs-components-links-module-AboutPageModule-dc14a33ffcc9e24195161ebdec504f13b97f1f0198fe32fdbc513a76d9f0aacc59de93d2869bf16149a2f8e893ac3c17176f25360d2684ed0b8628eec507b3bb"' }>
                                            <li class="link">
                                                <a href="components/AboutPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AboutPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AboutPageRoutingModule.html" data-type="entity-link" >AboutPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-369b69aefb6b2ed01e62d6b566dad364de4dda32c7f48ca21a2da92f6d11b1e31f1c683e532db6311e1fc6dcbd35b59a41605afdb9a514d61b522a3439403e28"' : 'data-bs-target="#xs-components-links-module-AppModule-369b69aefb6b2ed01e62d6b566dad364de4dda32c7f48ca21a2da92f6d11b1e31f1c683e532db6311e1fc6dcbd35b59a41605afdb9a514d61b522a3439403e28"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-369b69aefb6b2ed01e62d6b566dad364de4dda32c7f48ca21a2da92f6d11b1e31f1c683e532db6311e1fc6dcbd35b59a41605afdb9a514d61b522a3439403e28"' :
                                            'id="xs-components-links-module-AppModule-369b69aefb6b2ed01e62d6b566dad364de4dda32c7f48ca21a2da92f6d11b1e31f1c683e532db6311e1fc6dcbd35b59a41605afdb9a514d61b522a3439403e28"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/HomePageModule.html" data-type="entity-link" >HomePageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-HomePageModule-f92d7ce191b2704c0a4b2d9326998c9196cdca3c15001d4a36b7ab4877acac64834ddc50760ec1fbfecbd96bc28e25b8112d53e7581102af8eaede4acfcc06e7"' : 'data-bs-target="#xs-components-links-module-HomePageModule-f92d7ce191b2704c0a4b2d9326998c9196cdca3c15001d4a36b7ab4877acac64834ddc50760ec1fbfecbd96bc28e25b8112d53e7581102af8eaede4acfcc06e7"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HomePageModule-f92d7ce191b2704c0a4b2d9326998c9196cdca3c15001d4a36b7ab4877acac64834ddc50760ec1fbfecbd96bc28e25b8112d53e7581102af8eaede4acfcc06e7"' :
                                            'id="xs-components-links-module-HomePageModule-f92d7ce191b2704c0a4b2d9326998c9196cdca3c15001d4a36b7ab4877acac64834ddc50760ec1fbfecbd96bc28e25b8112d53e7581102af8eaede4acfcc06e7"' }>
                                            <li class="link">
                                                <a href="components/HomePage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomePage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HomePageRoutingModule.html" data-type="entity-link" >HomePageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/LoginPageModule.html" data-type="entity-link" >LoginPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-LoginPageModule-8ec9fce9b218a81da679441993ba11be637d00d6566acee311aed77923416fa28a2cbeecd50c03b8ab5d2d80b2d8ce25ee2f612b338e7678daace1921fa855a7"' : 'data-bs-target="#xs-components-links-module-LoginPageModule-8ec9fce9b218a81da679441993ba11be637d00d6566acee311aed77923416fa28a2cbeecd50c03b8ab5d2d80b2d8ce25ee2f612b338e7678daace1921fa855a7"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LoginPageModule-8ec9fce9b218a81da679441993ba11be637d00d6566acee311aed77923416fa28a2cbeecd50c03b8ab5d2d80b2d8ce25ee2f612b338e7678daace1921fa855a7"' :
                                            'id="xs-components-links-module-LoginPageModule-8ec9fce9b218a81da679441993ba11be637d00d6566acee311aed77923416fa28a2cbeecd50c03b8ab5d2d80b2d8ce25ee2f612b338e7678daace1921fa855a7"' }>
                                            <li class="link">
                                                <a href="components/LoginPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LoginPageRoutingModule.html" data-type="entity-link" >LoginPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MyplayersPageModule.html" data-type="entity-link" >MyplayersPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-MyplayersPageModule-995bd24159463dff2a9eccbd620e41c8f1977d7a793d901ad98a444b40d1ca5f5cf6f5449c935a5bb118ebd21f8163889bce5b44bd1fdbbbaed86bc829fa4eca"' : 'data-bs-target="#xs-components-links-module-MyplayersPageModule-995bd24159463dff2a9eccbd620e41c8f1977d7a793d901ad98a444b40d1ca5f5cf6f5449c935a5bb118ebd21f8163889bce5b44bd1fdbbbaed86bc829fa4eca"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MyplayersPageModule-995bd24159463dff2a9eccbd620e41c8f1977d7a793d901ad98a444b40d1ca5f5cf6f5449c935a5bb118ebd21f8163889bce5b44bd1fdbbbaed86bc829fa4eca"' :
                                            'id="xs-components-links-module-MyplayersPageModule-995bd24159463dff2a9eccbd620e41c8f1977d7a793d901ad98a444b40d1ca5f5cf6f5449c935a5bb118ebd21f8163889bce5b44bd1fdbbbaed86bc829fa4eca"' }>
                                            <li class="link">
                                                <a href="components/MyplayersPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MyplayersPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MyplayersPageRoutingModule.html" data-type="entity-link" >MyplayersPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MySquadsPageModule.html" data-type="entity-link" >MySquadsPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-MySquadsPageModule-e3f8a89487dc00413a4a6e5fd3eff3dd189c32af1c0706054d16390336ca82b6264fa657afb65007fa494229695ffe0d98e859dcfbe7e1821c7979ba04b1dec9"' : 'data-bs-target="#xs-components-links-module-MySquadsPageModule-e3f8a89487dc00413a4a6e5fd3eff3dd189c32af1c0706054d16390336ca82b6264fa657afb65007fa494229695ffe0d98e859dcfbe7e1821c7979ba04b1dec9"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MySquadsPageModule-e3f8a89487dc00413a4a6e5fd3eff3dd189c32af1c0706054d16390336ca82b6264fa657afb65007fa494229695ffe0d98e859dcfbe7e1821c7979ba04b1dec9"' :
                                            'id="xs-components-links-module-MySquadsPageModule-e3f8a89487dc00413a4a6e5fd3eff3dd189c32af1c0706054d16390336ca82b6264fa657afb65007fa494229695ffe0d98e859dcfbe7e1821c7979ba04b1dec9"' }>
                                            <li class="link">
                                                <a href="components/MySquadsPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MySquadsPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MySquadsPageRoutingModule.html" data-type="entity-link" >MySquadsPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RegisterPageModule.html" data-type="entity-link" >RegisterPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-RegisterPageModule-69bcc83daeb0c02703c00f48727c52d5db256bfe3a2eac7fd15d6a2f2efe0ed8f520c94e567643cff8b8c8468741ff98bab363e6f56483d1c3ffc2f0e14d3117"' : 'data-bs-target="#xs-components-links-module-RegisterPageModule-69bcc83daeb0c02703c00f48727c52d5db256bfe3a2eac7fd15d6a2f2efe0ed8f520c94e567643cff8b8c8468741ff98bab363e6f56483d1c3ffc2f0e14d3117"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-RegisterPageModule-69bcc83daeb0c02703c00f48727c52d5db256bfe3a2eac7fd15d6a2f2efe0ed8f520c94e567643cff8b8c8468741ff98bab363e6f56483d1c3ffc2f0e14d3117"' :
                                            'id="xs-components-links-module-RegisterPageModule-69bcc83daeb0c02703c00f48727c52d5db256bfe3a2eac7fd15d6a2f2efe0ed8f520c94e567643cff8b8c8468741ff98bab363e6f56483d1c3ffc2f0e14d3117"' }>
                                            <li class="link">
                                                <a href="components/RegisterPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisterPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/RegisterPageRoutingModule.html" data-type="entity-link" >RegisterPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link" >SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-SharedModule-3ba511e75898e48167cfbe5a83b379df6179a455dd8498ae18b11f56b76bd6aa898d15ae1f5c81b3347f589cd317b76ab6b91e06286f4ee6dc57362908073b90"' : 'data-bs-target="#xs-components-links-module-SharedModule-3ba511e75898e48167cfbe5a83b379df6179a455dd8498ae18b11f56b76bd6aa898d15ae1f5c81b3347f589cd317b76ab6b91e06286f4ee6dc57362908073b90"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-3ba511e75898e48167cfbe5a83b379df6179a455dd8498ae18b11f56b76bd6aa898d15ae1f5c81b3347f589cd317b76ab6b91e06286f4ee6dc57362908073b90"' :
                                            'id="xs-components-links-module-SharedModule-3ba511e75898e48167cfbe5a83b379df6179a455dd8498ae18b11f56b76bd6aa898d15ae1f5c81b3347f589cd317b76ab6b91e06286f4ee6dc57362908073b90"' }>
                                            <li class="link">
                                                <a href="components/HeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MatchComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MatchComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MatchFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MatchFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MatchItemComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MatchItemComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PictureSelectableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PictureSelectableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PlayerCardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PlayerCardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PlayerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PlayerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PlayerFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PlayerFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PlayerInfoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PlayerInfoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PlayerItemComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PlayerItemComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PlayerSearcherComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PlayerSearcherComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisterFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SquadComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SquadComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SquadFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SquadFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TrainingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TrainingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TrainingFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TrainingFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-SharedModule-3ba511e75898e48167cfbe5a83b379df6179a455dd8498ae18b11f56b76bd6aa898d15ae1f5c81b3347f589cd317b76ab6b91e06286f4ee6dc57362908073b90"' : 'data-bs-target="#xs-directives-links-module-SharedModule-3ba511e75898e48167cfbe5a83b379df6179a455dd8498ae18b11f56b76bd6aa898d15ae1f5c81b3347f589cd317b76ab6b91e06286f4ee6dc57362908073b90"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-SharedModule-3ba511e75898e48167cfbe5a83b379df6179a455dd8498ae18b11f56b76bd6aa898d15ae1f5c81b3347f589cd317b76ab6b91e06286f4ee6dc57362908073b90"' :
                                        'id="xs-directives-links-module-SharedModule-3ba511e75898e48167cfbe5a83b379df6179a455dd8498ae18b11f56b76bd6aa898d15ae1f5c81b3347f589cd317b76ab6b91e06286f4ee6dc57362908073b90"' }>
                                        <li class="link">
                                            <a href="directives/HighlightDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HighlightDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SplashPageModule.html" data-type="entity-link" >SplashPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-SplashPageModule-727947b01e4db276f0a5c4403e708630d8dfd079be0eee4e05cc96ea1e1eb5f9d5c2143d0c3880b7e12eb3c86d31333450eb3359a04f0cc31c9df176cedc0609"' : 'data-bs-target="#xs-components-links-module-SplashPageModule-727947b01e4db276f0a5c4403e708630d8dfd079be0eee4e05cc96ea1e1eb5f9d5c2143d0c3880b7e12eb3c86d31333450eb3359a04f0cc31c9df176cedc0609"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SplashPageModule-727947b01e4db276f0a5c4403e708630d8dfd079be0eee4e05cc96ea1e1eb5f9d5c2143d0c3880b7e12eb3c86d31333450eb3359a04f0cc31c9df176cedc0609"' :
                                            'id="xs-components-links-module-SplashPageModule-727947b01e4db276f0a5c4403e708630d8dfd079be0eee4e05cc96ea1e1eb5f9d5c2143d0c3880b7e12eb3c86d31333450eb3359a04f0cc31c9df176cedc0609"' }>
                                            <li class="link">
                                                <a href="components/SplashPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SplashPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SplashPageRoutingModule.html" data-type="entity-link" >SplashPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TrainingPageModule.html" data-type="entity-link" >TrainingPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-TrainingPageModule-6ae3b0961a580da65217746f55bd5658dec25c378959b968e112dc70f82c37ac7afd2d8f21c24a4ac33c83906e0282d9620e01f4c7547c029e03933a8a5b3c59"' : 'data-bs-target="#xs-components-links-module-TrainingPageModule-6ae3b0961a580da65217746f55bd5658dec25c378959b968e112dc70f82c37ac7afd2d8f21c24a4ac33c83906e0282d9620e01f4c7547c029e03933a8a5b3c59"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TrainingPageModule-6ae3b0961a580da65217746f55bd5658dec25c378959b968e112dc70f82c37ac7afd2d8f21c24a4ac33c83906e0282d9620e01f4c7547c029e03933a8a5b3c59"' :
                                            'id="xs-components-links-module-TrainingPageModule-6ae3b0961a580da65217746f55bd5658dec25c378959b968e112dc70f82c37ac7afd2d8f21c24a4ac33c83906e0282d9620e01f4c7547c029e03933a8a5b3c59"' }>
                                            <li class="link">
                                                <a href="components/TrainingPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TrainingPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TrainingPageRoutingModule.html" data-type="entity-link" >TrainingPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/UserPageModule.html" data-type="entity-link" >UserPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-UserPageModule-ef91221bb2983251fcbcdd67d2712071d1c02d38cad95f6b43d3708c9cfb5c4c42fb2f878c6b7987fe6ecb341bcd6dd68560a64f4184f97eddc5658dd52de596"' : 'data-bs-target="#xs-components-links-module-UserPageModule-ef91221bb2983251fcbcdd67d2712071d1c02d38cad95f6b43d3708c9cfb5c4c42fb2f878c6b7987fe6ecb341bcd6dd68560a64f4184f97eddc5658dd52de596"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-UserPageModule-ef91221bb2983251fcbcdd67d2712071d1c02d38cad95f6b43d3708c9cfb5c4c42fb2f878c6b7987fe6ecb341bcd6dd68560a64f4184f97eddc5658dd52de596"' :
                                            'id="xs-components-links-module-UserPageModule-ef91221bb2983251fcbcdd67d2712071d1c02d38cad95f6b43d3708c9cfb5c4c42fb2f878c6b7987fe6ecb341bcd6dd68560a64f4184f97eddc5658dd52de596"' }>
                                            <li class="link">
                                                <a href="components/UserPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserPageRoutingModule.html" data-type="entity-link" >UserPageRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AuthFirebaseService.html" data-type="entity-link" >AuthFirebaseService</a>
                            </li>
                            <li class="link">
                                <a href="classes/PasswordValidation.html" data-type="entity-link" >PasswordValidation</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CoachService.html" data-type="entity-link" >CoachService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CustomTranslateService.html" data-type="entity-link" >CustomTranslateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExportDataService.html" data-type="entity-link" >ExportDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FirebaseService.html" data-type="entity-link" >FirebaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MatchService.html" data-type="entity-link" >MatchService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MediaFirebaseService.html" data-type="entity-link" >MediaFirebaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MediaService.html" data-type="entity-link" >MediaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PlayerService.html" data-type="entity-link" >PlayerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SquadService.html" data-type="entity-link" >SquadService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TrainingService.html" data-type="entity-link" >TrainingService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/UserGuard.html" data-type="entity-link" >UserGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Coach.html" data-type="entity-link" >Coach</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FirebaseDocument.html" data-type="entity-link" >FirebaseDocument</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FirebaseStorageFile.html" data-type="entity-link" >FirebaseStorageFile</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FirebaseUserCredential.html" data-type="entity-link" >FirebaseUserCredential</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Match.html" data-type="entity-link" >Match</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Media.html" data-type="entity-link" >Media</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Player.html" data-type="entity-link" >Player</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Squad.html" data-type="entity-link" >Squad</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Training.html" data-type="entity-link" >Training</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserCredentials.html" data-type="entity-link" >UserCredentials</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserRegisterInfo.html" data-type="entity-link" >UserRegisterInfo</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});