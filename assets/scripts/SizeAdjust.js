const Options = {
  minWidth: 480,
  maxWidth: 1365,
  measure: "rem"
}

const CSSDeclarations = [
  {
    selector: ".card h3",
    propAndValue: [
      { property: "font-size", min: 0.9, max: 1 },
    ]
  },

  {
    selector: ".card p",
    propAndValue: [
      { property: "font-size", min: 1.8, max: 2 },
      { property: "line-height", min: 2.8, max: 3 },
      { property: "margin-top", min: 0.3, max: 1 }
    ]
  },

  {
    selector: ".menu h2",
    propAndValue: [
      { property: "font-size", min: 1.3, max: 1.5 },
      { property: "margin-bottom", min: 1, max: 1.5 },
    ]
  },

  {
    selector: ".menu ul",
    propAndValue: [
      { property: "margin-top", min: 1, max: 1.5 },
    ]
  },

  {
    selector: ".menu li a span",
    propAndValue: [
      { property: "font-size", min: 0.9, max: 1 },
    ]
  },

  {
    selector: ".menu li a i",
    propAndValue: [
      { property: "font-size", min: 2.4, max: 3 },
    ]
  }
]

const SizeAdjust = {
  createStyleEl() {
    const styleEl = document.createElement('style')
    styleEl.setAttribute("id", "size-adjust")
    document.querySelector('head').appendChild(styleEl)
    styleEl.insertAdjacentHTML("beforebegin", "<!-- Style injected by SizeAdjust (github.com/ruuuff) -->")
  },

  scale(num, in_min, in_max, out_min, out_max) {
    let value = (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
    
    value <= out_min ? value = out_min : value
    value >= out_max ? value = out_max : value

    return value
  },

  callScaleWithParameters(min, max) {
    return SizeAdjust.scale(Number(document.documentElement.clientWidth), Number(Options.minWidth), Number(Options.maxWidth), Number(min), Number(max))
  },

  formatSize(sizeToFormat) {
    return parseFloat(sizeToFormat.toFixed(3))
  },

  innerStyles() {
    const style = document.querySelector('head style#size-adjust')
    style.innerHTML = ""

    CSSDeclarations.forEach(({ selector, propAndValue }, index) => {
      style.insertAdjacentHTML("beforeend", `${selector} {`)

      propAndValue.forEach(({ property, min, max }) => {
        const size = SizeAdjust.formatSize(SizeAdjust.callScaleWithParameters(min, max))

        style.insertAdjacentHTML("beforeend", `  ${property}: ${size + Options.measure};`)
      })
      style.insertAdjacentHTML("beforeend", index !== CSSDeclarations.length - 1 ? `}
      ` : `}`)
    })
  },
}

SizeAdjust.createStyleEl()
SizeAdjust.innerStyles()
window.addEventListener('resize', SizeAdjust.innerStyles)