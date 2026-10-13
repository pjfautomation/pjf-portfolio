// Portfolio sample interactions stay local. No request or payment is transmitted.
;(() => {
  const root = document.documentElement
  const themeButton = document.querySelector('[data-theme-toggle]')
  let inherited = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  try {
    if (window.parent !== window)
      inherited = window.parent.document.documentElement.dataset.theme || inherited
  } catch {
    /* Standalone theme remains available across origins. */
  }
  function setTheme(theme) {
    root.dataset.theme = theme
    themeButton?.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
    )
  }
  setTheme(inherited)
  themeButton?.addEventListener('click', () =>
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'),
  )
  const form = document.querySelector('form')
  if (form) {
    form.noValidate = true
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      let firstInvalid
      for (const field of form.querySelectorAll('input, select, textarea')) {
        const error = document.getElementById(`${field.id}-error`)
        if (field.required && field.type !== 'email')
          field.setCustomValidity(field.value.trim() ? '' : 'Please complete this field.')
        const valid = field.checkValidity()
        field.setAttribute('aria-invalid', String(!valid))
        if (error)
          error.textContent = valid
            ? ''
            : field.type === 'email'
              ? 'Enter a valid email address.'
              : 'Please complete this field.'
        if (!valid && !firstInvalid) firstInvalid = field
      }
      if (firstInvalid) {
        firstInvalid.focus()
        return
      }
      const data = new FormData(form)
      document.querySelector('[role="status"]').textContent =
        `${data.get('name').trim()}, here is your sample request.\n${data.get('email')}\n${data.get('area') || data.get('message')}\n${data.get('clean') ? `${data.get('clean')} · ${data.get('bedrooms')} bedrooms\n` : ''}Portfolio demo. No request was sent.`
    })
    form.addEventListener('input', (event) => {
      const field = event.target
      if ('setCustomValidity' in field) field.setCustomValidity('')
      field.removeAttribute('aria-invalid')
      const error = document.getElementById(`${field.id}-error`)
      if (error) error.textContent = ''
      document.querySelector('[role="status"]').textContent = ''
    })
  }
  if (document.body.classList.contains('shop')) {
    let color = 'Graphite'
    let cart
    const quantity = document.querySelector('#quantity')
    const photo = document.querySelector('#product-image')
    const status = document.querySelector('[role="status"]')
    const checkout = document.querySelector('#checkout')
    const showFront = () => {
      photo.src = `assets/daypack-${color.toLowerCase()}.png`
      photo.alt = `Fieldwork Daypack in ${color}, front and side view`
      document.querySelector('#selected-color').textContent = color
      for (const view of document.querySelectorAll('[data-view]'))
        view.setAttribute('aria-pressed', String(view.dataset.view === 'front'))
    }
    for (const view of document.querySelectorAll('[data-view]'))
      view.addEventListener('click', () => {
        if (view.dataset.view === 'front') showFront()
        else {
          photo.src = 'assets/daypack-detail.png'
          document.querySelector('#selected-color').textContent = 'Graphite, interior view'
          photo.alt =
            'Graphite Fieldwork Daypack interior showing a laptop compartment and notebook'
          for (const option of document.querySelectorAll('[data-view]'))
            option.setAttribute('aria-pressed', String(option === view))
        }
      })
    const empty = () => {
      cart = undefined
      status.textContent = ''
      checkout.hidden = true
    }
    for (const button of document.querySelectorAll('[data-color]'))
      button.addEventListener('click', () => {
        color = button.dataset.color
        for (const option of document.querySelectorAll('[data-color]'))
          option.setAttribute('aria-pressed', String(option.dataset.color === color))
        showFront()
        document.querySelector('#selected-color').textContent = color
        empty()
      })
    quantity.addEventListener('change', empty)
    document.querySelector('#add-to-bag').addEventListener('click', () => {
      const count = Number(quantity.value)
      cart = { count, color, total: count * 89 }
      status.textContent = `${cart.count} × Fieldwork Daypack · ${cart.color} · $${cart.total}\nAdded to your sample bag.`
      checkout.hidden = false
    })
    checkout.addEventListener('click', () => {
      if (cart)
        status.textContent = `${cart.count} × Fieldwork Daypack · ${cart.color} · $${cart.total}\nPortfolio checkout preview. No payment was taken and no order was placed.`
    })
  }
})()
