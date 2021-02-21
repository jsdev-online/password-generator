const app = new Vue({
  el: '#app',
  data: {
    length: 12,
    options: {
      numbers: {
        checked: true,
        characters: () => Array.from({ length: 57 - 47 }, (_, i) => 48 + i),
        label: 'Numbers',
      },
      lowercase: {
        checked: true,
        characters: () => Array.from({ length: 122 - 96 }, (_, i) => 97 + i),
        label: 'Lowercase Letters',
      },
      uppercase: {
        checked: true,
        characters: () => Array.from({ length: 90 - 64 }, (_, i) => 65 + i),
        label: 'Uppercase letters',
      },
      special: {
        checked: false,
        characters: () => {
          let chars = Array.from({ length: 47 - 32 }, (_, i) => 33 + i)
          chars = chars.concat(
            Array.from({ length: 64 - 57 }, (_, i) => 58 + i)
          )

          return chars
        },
        label: 'Special characters',
      },
      ambigious: {
        checked: false,
        characters: () => {
          let chars = Array.from({ length: 96 - 90 }, (_, i) => 91 + i)

          chars = chars.concat(
            Array.from({ length: 126 - 122 }, (_, i) => 123 + i)
          )
        },
        label: 'Ambigious characters',
      },
    },
    password: '',
    message: false,
    qrModal: false,
  },
  mounted: function () {
    this.generate()
  },
  methods: {
    generate: function () {
      let chars = []
      let password = new String()

      for (const [index, option] of Object.entries(this.options)) {
        chars = chars.concat(option.checked ? option.characters() : [])
      }
      const characters = String.fromCharCode(...chars)
      for (let i = 0; i < this.length; i++) {
        password += characters.charAt(
          Math.floor(Math.random() * characters.length)
        )
      }
      this.password = password
    },
    copy: function () {
      const password = this.$refs['password']
      password.select()
      document.execCommand('copy')
      this.message = 'Copied!'

      setTimeout(() => {
        this.message = false
      }, 1000)
    },
    download: function () {
      var element = document.createElement('a')
      element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(this.password)
      )
      element.setAttribute('download', 'password.txt')

      element.style.display = 'none'
      document.body.appendChild(element)

      element.click()

      document.body.removeChild(element)
    },
    showQr: function () {
      this.$refs['qrcode'].innerHTML = ''
      new QRCode(this.$refs['qrcode'], this.password)
      this.qrModal = true
    },
    qr: function () {
      if (typeof QRCode !== 'function') {
        script = document.createElement('script')
        scripts = document.getElementsByTagName('script')[0]
        script.src = './js/qrcode.min.js'
        scripts.parentNode.insertBefore(script, scripts)
        script.addEventListener('load', this.showQr)
        return true
      }
      return this.showQr()
    },
  },
  watch: {
    options: {
      handler: 'generate',
      deep: true,
    },
    length: {
      handler: 'generate',
    },
  },
})
