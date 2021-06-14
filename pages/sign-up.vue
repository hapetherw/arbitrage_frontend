<template>
  <div class="main-container bg-primary" :class="($mq==='xl' || $mq==='lg') ? 'desktop' : 'mobile'">
    <b-container class="py-4">
      <b-overlay
        :show="modalLoading"
        spinner-variant="secondary"
        opacity="0"
        no-wrap
      />
      <b-form class="px-3" @keyup.enter="registerAction">
        <b-row>
          <b-col cols="12" class="d-flex justify-content-center">
            <h2 class="text-secondary text- text-uppercase">
              {{ $t('register') }}
            </h2>
          </b-col>
        </b-row>
        <b-row cols="1" cols-md="2" cols-lg="2" cols-xl="2">
          <b-col>
            <b-form-row>
              <b-col cols="12">
                <b-form-group>
                  <b-form-input
                    v-model="$v.registerForm.username.$model"
                    :state="RegisterValidateState('username')"
                    :placeholder="$t('username')"
                    debounce="500"
                    @change="updateUsername"
                  />
                  <b-form-invalid-feedback>
                    {{ $t('field_required') }}
                  </b-form-invalid-feedback>
                </b-form-group>
                <b-form-invalid-feedback :state="!isDuplicatedUser">
                  {{ $t('username_duplicated') }}
                </b-form-invalid-feedback>
              </b-col>
              <b-col cols="12">
                <b-form-group>
                  <b-form-input
                    v-model="$v.registerForm.password.$model"
                    type="password"
                    :state="RegisterValidateState('password')"
                    :placeholder="$t('password')"
                  />
                  <b-form-invalid-feedback>
                    {{ $t('password_validation') }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group>
                  <b-form-input
                    v-model="$v.registerForm.confirmPassword.$model"
                    type="password"
                    :state="RegisterValidateState('confirmPassword')"
                    :placeholder="$t('confirm_password')"
                  />
                  <b-form-invalid-feedback>
                    {{ $t('confirm_password_validation') }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group>
                  <b-form-input
                    v-model="$v.registerForm.email.$model"
                    type="email"
                    :state="RegisterValidateState('email')"
                    :placeholder="$tc('email_address', 1)"
                  />
                  <b-form-invalid-feedback>
                    {{ $t('email_validation') }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group>
                  <b-row>
                    <b-col cols="5" class="pr-0">
                      <v-select
                        v-model="registerForm.countryPhone"
                        label="text"
                        class="sign-select"
                        :options="countryPhoneList"
                        :get-option-label="phone => '(' + phone.value + ')'"
                        :clearable="false"
                      >
                        <template v-slot:option="{text, value}">
                          {{ text + ' (' + value + ')' }}
                        </template>
                        <template slot="no-options">
                          {{ $t('no_match_options') }}
                        </template>
                      </v-select>
                    </b-col>
                    <b-col cols="7" class="pl-1">
                      <b-form-input
                        v-model="$v.registerForm.phone_number1.$model"
                        :state="RegisterValidateState('phone_number1')"
                        :placeholder="$t('phone_number')"
                        debounce="500"
                        @input="checkPhoneNumberLengthAction"
                      />
                      <b-form-invalid-feedback>
                        {{ $t('phone_number_validation') }}
                      </b-form-invalid-feedback>
                    </b-col>
                  </b-row>
                </b-form-group>
                <b-form-invalid-feedback :state="validPhoneNumberLength">
                  {{ $t('phone_number_length_check') }}
                </b-form-invalid-feedback>
              </b-col>
              <b-col cols="12">
                <b-form-group>
                  <v-date-picker
                    v-model="registerForm.birthday"
                    :masks="calendarMask"
                    :model-config="calendarConfig"
                    :max-date="calendarMaxDate"
                    :locale="$i18n.locale"
                    is-dark
                  >
                    <template v-slot="{ inputValue, togglePopover }">
                      <b-input-group class="calendar-input">
                        <template v-slot:prepend>
                          <b-input-group-text>
                            <font-awesome-icon :icon="['fas', 'calendar-alt']" class="text-info" />
                          </b-input-group-text>
                        </template>
                        <b-form-input
                          readonly
                          class="bg-primary rounded"
                          :value="inputValue"
                          :placeholder="$t('birthday')"
                          :state="hasBirthday"
                          @click="togglePopover"
                          @focus="isCalendarFocus=true"
                        />
                        <b-form-invalid-feedback>
                          {{ $t('field_required') }}
                        </b-form-invalid-feedback>
                      </b-input-group>
                    </template>
                  </v-date-picker>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group>
                  <b-form-radio-group v-model="registerForm.gender">
                    <b-form-radio value="male" class="sign-radio">
                      {{ $t('male') }}
                    </b-form-radio>
                    <b-form-radio value="female" class="sign-radio">
                      {{ $t('female') }}
                    </b-form-radio>
                  </b-form-radio-group>
                </b-form-group>
              </b-col>
            </b-form-row>
          </b-col>
          <b-col>
            <b-form-row>
              <b-col cols="12">
                <b-form-group>
                  <b-form-input
                    v-model="$v.registerForm.first_name.$model"
                    :state="RegisterValidateState('first_name')"
                    :placeholder="$t('first_name')"
                  />
                  <b-form-invalid-feedback>
                    {{ $t('field_required') }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group>
                  <b-form-input
                    v-model="$v.registerForm.last_name.$model"
                    :state="RegisterValidateState('last_name')"
                    :placeholder="$t('last_name')"
                  />
                  <b-form-invalid-feedback>
                    {{ $t('field_required') }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group>
                  <b-form-input
                    v-model="$v.registerForm.address.$model"
                    :state="RegisterValidateState('address')"
                    :placeholder="$t('address')"
                  />
                  <b-form-invalid-feedback>
                    {{ $t('field_required') }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group>
                  <b-form-input
                    v-model="$v.registerForm.postal_code.$model"
                    :state="RegisterValidateState('postal_code')"
                    :placeholder="$t('postal_code')"
                  />
                  <b-form-invalid-feedback>
                    {{ $t('field_required') }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group>
                  <b-form-input
                    v-model="$v.registerForm.city.$model"
                    :state="RegisterValidateState('city')"
                    :placeholder="$t('city')"
                  />
                  <b-form-invalid-feedback>
                    {{ $t('field_required') }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group>
                  <v-select
                    v-model="registerForm.country"
                    label="text"
                    class="sign-select"
                    :options="countryList"
                    :clearable="false"
                  >
                    <template slot="no-options">
                      {{ $t('no_match_options') }}
                    </template>
                  </v-select>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-group>
                  <v-select
                    v-model="registerForm.interface_local"
                    :reduce="lan => lan.value"
                    label="text"
                    class="sign-select"
                    :options="userLanguageList"
                    :clearable="false"
                    :searchable="false"
                  >
                    <template slot="no-options">
                      {{ $t('no_match_options') }}
                    </template>
                  </v-select>
                </b-form-group>
              </b-col>
            </b-form-row>
          </b-col>
        </b-row>
        <b-row class="my-2">
          <b-col cols="9">
            <b-button
              pill
              size="sm"
              variant="outline-light text-white border-white"
              @click="hasPromoCode=!hasPromoCode"
            >
              {{ $t('have_promo_code') }}
            </b-button>
            <b-collapse v-model="hasPromoCode" class="mt-2">
              <b-form-group>
                <b-form-input
                  v-model="registerForm.promo_code"
                  :placeholder="$tc('promo_code', 2)"
                  debounce="500"
                  :state="isValidPromoCode"
                  @change="validatePromoCodeAction"
                />
                <b-form-invalid-feedback :state="isValidPromoCode">
                  {{ $t('invalid_promo_code') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-collapse>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12">
            <b-form-group>
              <b-form-checkbox
                v-model="registerForm.notify_newletter"
                :value="true"
                :unchecked-value="false"
              >
                {{ $t('receive_news') }}
              </b-form-checkbox>
            </b-form-group>
          </b-col>
          <b-col cols="12">
            <b-form-group>
              <b-form-checkbox
                v-model="$v.registerForm.checkTerms.$model"
                :state="RegisterValidateState('checkTerms')"
                :value="true"
                :unchecked-value="false"
              >
                {{ $t('agree_terms') }}
                <b-link href="/faq/5" class="text-secondary" style="text-decoration-line: underline">{{ $t('terms_conditions') }}</b-link>
              </b-form-checkbox>
              <b-form-invalid-feedback :state="RegisterValidateState('checkTerms')">
                {{ $t('accept_terms') }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="my-2">
          <b-col cols="12" class="d-flex justify-content-center">
            <b-button
              pill
              variant="secondary text-dark"
              class="orange-btn"
              style="text-transform: none;"
              @click="registerAction"
            >
              {{ $t('create_new_account') }}
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </b-container>
    <Footer />
    <b-modal
      v-model="depositModal"
      size="md"
      centered
      button-size="sm"
      hide-footer
      no-close-on-backdrop
      header-bg-variant="primary"
      header-text-variant="white"
      body-bg-variant="primary"
      body-text-variant="white"
      footer-bg-variant="primary"
      footer-text-variant="white"
    >
      <template v-slot:modal-header="{}">
        <h6 style="text-transform: uppercase;font-weight: bold">
          {{ $t('welcome') }}
        </h6>
      </template>
      <b-form class="px-3">
        <b-row align-h="center">
          <b-col cols="12" class="d-flex justify-content-center align-items-center mb-2">
            <h3>{{ $t('congratulations') }}</h3>
          </b-col>
          <b-col cols="12" class="d-flex justify-content-center align-items-center text-info mb-4">
            <h4>{{ $t('register_message') }}</h4>
          </b-col>
          <b-col cols="12" class="d-flex justify-content-center align-items-center">
            <h6>{{ $t('register_redirect_message', [redirectSecond]) }}</h6>
          </b-col>
        </b-row>
        <b-row class="mt-2 mb-3">
          <b-col cols="12" class="d-flex justify-content-center">
            <b-button
              pill
              block
              variant="secondary text-dark"
              class="orange-btn"
              style="text-transform: uppercase;"
              @click="depositAction"
            >
              {{ $t('deposit_now') }}
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </b-modal>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import countryData from 'countries-list'
import { validationMixin } from 'vuelidate'
import { required, minLength, sameAs, email, numeric } from 'vuelidate/lib/validators'
import moment from 'moment'
import common from '~/mixins/common'
export default {
  mixins: [validationMixin, common],
  data: () => ({
    calendarMaxDate: new Date(),
    registerForm: {
      username: null,
      password: null,
      confirmPassword: null,
      email: null,
      countryPhone: null,
      phone_number1: null,
      city: null,
      country: null,
      promo_code: null,
      gender: 'male',
      birthday: null,
      first_name: null,
      last_name: null,
      address: null,
      postal_code: null,
      interface_local: 'en',
      checkTerms: null,
      notify_newletter: false
    },
    calendarMask: {
      input: 'YYYY-MM-DD'
    },
    calendarConfig: {
      type: 'string',
      mask: 'YYYY-MM-DD' // Uses 'iso' if missing
    },
    isCalendarFocus: false,
    countryPhoneList: [],
    countryList: [],
    userLanguageList: [],
    hasPromoCode: false,
    checkNews: false,
    checkTerms: false,
    isSentMessage: false,
    isDuplicatedUser: false,
    isValidPromoCode: true,
    validPhoneNumberLength: true,
    forgotPasswordModal: false,
    depositModal: false,
    redirectSecond: 5,
    timer: null,
    isLoginFailed: false,
    modalLoading: false,
    forgotPasswordResult: 0
  }),
  validations: {
    registerForm: {
      username: {
        required
      },
      password: {
        required,
        minLength: minLength(3)
      },
      confirmPassword: {
        required,
        sameAsPassword: sameAs('password')
      },
      email: {
        required,
        email
      },
      phone_number1: {
        required,
        numeric
      },
      first_name: {
        required
      },
      last_name: {
        required
      },
      address: {
        required
      },
      postal_code: {
        required
      },
      city: {
        required
      },
      checkTerms: {
        checked: value => value === true
      }
    }
  },
  computed: {
    ...mapGetters(['loggedIn', 'loggedUser', 'getCountryCode']),
    hasBirthday () {
      return this.registerForm.birthday !== null
    }
  },
  created () {
    if (this.loggedIn && this.loggedUser) {
      this.$router.push(this.localePath('/online-casino', this.$i18n.locale))
    }
  },
  async mounted () {
    const date = new Date()
    date.setFullYear(date.getFullYear() - 18)
    this.registerForm.birthday = moment(date).format('YYYY-MM-DD')
    this.calendarMaxDate.setFullYear(this.calendarMaxDate.getFullYear() - 18)
    Object.keys(countryData.countries).forEach((key) => {
      this.countryPhoneList.push({
        text: countryData.countries[key].name,
        value: '+' + countryData.countries[key].phone.split(',')[0]
      })
      this.countryList.push({
        text: countryData.countries[key].name,
        value: key
      })
    })
    this.setLanguageData()
    this.registerForm.countryPhone = this.countryPhoneList[0]
    await this.getLocationInfo()
  },
  methods: {
    ...mapActions(['setManagementTab', 'setBalanceInfo', 'setGamePlayStatus', 'setBonusCode']),
    ...mapActions('player', ['validatePlayerName', 'registerPlayer', 'resetPassword']),
    ...mapActions('playerMessage', ['sendMessage']),
    ...mapActions('bonus', ['validatePromoCode']),
    RegisterValidateState (name) {
      const { $dirty, $error } = this.$v.registerForm[name]
      return $dirty ? !$error : null
    },
    async updateUsername (value) {
      if (value === null || value.length === 0) {
        return
      }
      try {
        const data = await this.validatePlayerName({
          $axios: this.$axios,
          params: {
            username: value
          }
        })
        if (data.status === 0) {
          this.isDuplicatedUser = true
        } else {
          this.isDuplicatedUser = false
        }
      } catch (e) {
        console.log(e)
      }
    },
    checkPhoneNumberLengthAction (value) {
      if (value === null || value.length === 0) {
        this.validPhoneNumberLength = false
      } else if ((this.registerForm.countryPhone.value.length - 1) + value.length < 7) {
        this.validPhoneNumberLength = false
      } else {
        this.validPhoneNumberLength = true
      }
    },
    async validatePromoCodeAction (value) {
      if (value === null || value.length === 0) {
        this.isValidPromoCode = true
        return this.isValidPromoCode
      }
      try {
        const data = await this.validatePromoCode({
          $axios: this.$axios,
          params: {
            promo_code: value
          }
        })
        if (data.status === 0) {
          this.isValidPromoCode = false
        } else {
          this.isValidPromoCode = true
        }
      } catch (e) {
        this.isValidPromoCode = false
        console.log(e)
      }
      return this.isValidPromoCode
    },
    setLanguageData () {
      this.userLanguageList = []
      Object.keys(this.languageList).forEach((key) => {
        this.userLanguageList.push({
          text: this.$t(this.languageList[key].name.toLowerCase()),
          value: key
        })
      })
    },
    getLocationInfo () {
      this.registerForm.countryPhone = {
        text: countryData.countries[this.getCountryCode].name,
        value: '+' + countryData.countries[this.getCountryCode].phone.split(',')[0]
      }
      this.registerForm.country = {
        text: countryData.countries[this.getCountryCode].name,
        value: this.getCountryCode
      }
    },
    async registerAction () {
      this.$v.registerForm.$touch()
      if (!this.$v.registerForm.$anyError && this.hasBirthday && this.isValidPromoCode && this.validPhoneNumberLength) {
        this.registerForm.phone_number = this.registerForm.countryPhone.value + this.registerForm.phone_number1
        this.registerForm.country = this.registerForm.country.value
        if (this.$route.query.tracking_code) {
          this.registerForm.tracking_code = this.$route.query.tracking_code
        } else {
          this.registerForm.tracking_code = null
        }
        try {
          const data = await this.registerPlayer({
            $axios: this.$axios,
            params: this.registerForm
          })
          if (data.status === 1) {
            await this.$nuxt.$emit('run-login-action', { username: this.registerForm.username, password: this.registerForm.password })
            await this.showDepositModal()
          }
        } catch (e) {
          console.log(e)
        }
      }
    },
    showDepositModal () {
      this.depositModal = true
      this.timer = setInterval(() => {
        if (this.redirectSecond === 0) {
          clearInterval(this.timer)
          this.depositAction()
        }
        this.redirectSecond = this.redirectSecond - 1
      }, 1000)
    },
    async depositAction () {
      this.depositModal = false
      clearInterval(this.timer)
      this.redirectSecond = 5
      this.setBonusCode('')
      this.setManagementTab(2)
      await this.$router.push(this.localePath('/user-management', this.$i18n.locale))
    }
  }
}
</script>
