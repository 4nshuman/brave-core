/* Copyright (c) 2024 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

import { createStateManager } from '../../shared/lib/state_manager'
import { createLocaleContextForTesting } from '../../shared/lib/locale_context'
import { AppModel, AppState, defaultState, defaultModel } from '../lib/app_model'
import { localeStrings } from '../lib/locale_strings'
import { optional } from '../../shared/lib/optional'

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export function createModel(): AppModel {
  const locale = createLocaleContextForTesting(localeStrings)
  const stateManager = createStateManager<AppState>({
    ...defaultState(),
    loading: false,
    paymentId: 'abc123',
    countryCode: 'US',
    adsInfo: {
      adsEnabled: {
        'new-tab-page': true,
        'notification': false,
        'search-result': true,
        'inline-content': false
      },
      adsReceivedThisMonth: 97,
      adTypesReceivedThisMonth: {
        'new-tab-page': 92,
        'notification': 4,
        'search-result': 1,
        'inline-content': 0
      },
      minEarningsThisMonth: 21.244,
      maxEarningsThisMonth: 32.980,
      nextPaymentDate: Date.now(),
      notificationAdsPerHour: 5,
      shouldAllowSubdivisionTargeting: true,
      currentSubdivision: 'US-NY',
      availableSubdivisions: [
        { code: 'US-NY', name: 'New York' },
        { code: 'US-CA', name: 'California' }
      ],
      autoDetectedSubdivision: 'US-NY'
    },
    externalWallet: {
      provider: 'solana',
      name: 'Test Account',
      authenticated: true,
      url: ''
    },
    balance: optional(4.167),
    autoContributeInfo: {
      enabled: true,
      amount: 7,
      nextAutoContributeDate: Date.now(),
      entries: [
        {
          site: {
            id: '1',
            icon: '',
            name: 'The Verge',
            url: 'https://brave.com',
            platform: ''
          },
          attention: .4
        },
        {
          site: {
            id: '2',
            icon: '',
            name: 'Brave',
            url: 'https://brave.com',
            platform: ''
          },
          attention: .3
        },
        {
          site: {
            id: '3',
            icon: '',
            name: 'Brave',
            url: 'https://brave.com',
            platform: '',
          },
          attention: .3
        },
        {
          site: {
            id: '4',
            icon: '',
            name: 'Brave',
            url: 'https://brave.com',
            platform: ''
          },
          attention: .15
        },
        {
          site: {
            id: '5',
            icon: '',
            name: 'Brave',
            url: 'https://brave.com',
            platform: ''
          },
          attention: .1
        },
        {
          site: {
            id: '6',
            icon: '',
            name: 'Brave',
            url: 'https://brave.com',
            platform: ''
          },
          attention: .05
        }
      ]
    },
    recurringContributions: [
      {
        site: {
          id: '1',
          icon: '',
          name: 'Alice',
          url: 'https://brave.com',
          platform: ''
        },
        amount: 2.5,
        nextContributionDate: Date.now() - 10000
      },
      {
        site: {
          id: '2',
          icon: '',
          name: 'Bob',
          url: 'https://brave.com',
          platform: 'youtube'
        },
        amount: 1.5,
        nextContributionDate: Date.now()
      }
    ],
    rewardsParameters: {
      autoContributeChoices: [1, 2, 5, 10],
      rate: .56,
      walletProviderRegions: {
        bitflyer: { allow: [], block: [] },
        gemini: { allow: [], block: ['US'] },
        uphold: { allow: [], block: [] }
      }
    },
    currentCreator: {
      site: {
        id: 'wikipedia.org',
        platform: '',
        url: 'https://wikipedia.org',
        name: 'wikipedia.org',
        icon: ''
      },
      banner: {
        title: 'Wikipedia',
        description: '',
        background: ''
      }
    }
  })

  return {
    ...defaultModel(),

    getString: locale.getString,
    getPluralString: locale.getPluralString,
    getState: stateManager.getState,
    addListener: stateManager.addListener,

    async getAvailableCountries() {
      return {
        countryCodes: ['US'],
        defaultCountryCode: 'US'
      }
    },

    async getExternalWalletProviders() {
      return ['uphold', 'gemini', 'solana']
    },

    async enableRewards(countryCode) {
      await delay(500)
      setTimeout(() => {
        stateManager.update({ paymentId: 'abc123' })
      }, 20)
      return 'success'
    },

    async beginExternalWalletLogin(provider) {
      await delay(500)
      return false
    },

    async connectExternalWallet(provider, args) {
      await delay(2000)
      return 'unexpected-error'
    },

    async setAdTypeEnabled(adType, enabled) {
      const { adsInfo } = stateManager.getState()
      if (adsInfo) {
        adsInfo.adsEnabled[adType] = enabled
        stateManager.update({ adsInfo })
      }
    },

    async setNotificationAdsPerHour(adsPerHour) {
      const { adsInfo } = stateManager.getState()
      if (adsInfo) {
        adsInfo.notificationAdsPerHour = adsPerHour
        stateManager.update({ adsInfo })
      }
    },

    async setAdsSubdivision(subdivision) {
      const { adsInfo } = stateManager.getState()
      if (adsInfo) {
        adsInfo.currentSubdivision = subdivision
        stateManager.update({ adsInfo })
      }
    },

    async getAdsHistory() {
      return [
        {
          createdAt: Date.now(),
          id: '123',
          name: 'Brave',
          text: 'Data Regulation & GDPR...',
          domain: 'kite.lnk',
          url: 'https://brave.com',
          likeStatus: '',
          inappropriate: false
        },
        {
          createdAt: Date.now(),
          id: '124',
          name: 'Brave',
          text: 'Data Regulation & GDPR...',
          domain: 'kite.lnk',
          url: 'https://brave.com',
          likeStatus: 'liked',
          inappropriate: false
        }
      ]
    },

    async setAutoContributeEnabled(enabled) {
      const { autoContributeInfo } = stateManager.getState()
      autoContributeInfo!.enabled = enabled
      stateManager.update({ autoContributeInfo })
    },

    async setAutoContributeAmount(amount) {
      const { autoContributeInfo } = stateManager.getState()
      autoContributeInfo!.amount = amount
      stateManager.update({ autoContributeInfo })
    },

    async removeAutoContributeSite(id) {
      const { autoContributeInfo } = stateManager.getState()
      autoContributeInfo!.entries =
        autoContributeInfo!.entries.filter((entry) => entry.site.id !== id)
      stateManager.update({ autoContributeInfo })
    },

    async removeRecurringContribution(id) {
      let { recurringContributions } = stateManager.getState()
      recurringContributions = recurringContributions.filter((entry) => {
        return entry.site.id !== id
      })
      stateManager.update({ recurringContributions })
    }

  }
}
