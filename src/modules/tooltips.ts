import { UserModule } from '~/types'
import { computePosition, flip, shift, offset, arrow, inline } from '@floating-ui/dom'
interface Coords {
  x: number,
  y: number
}

export const install: UserModule = ({ app, isClient }) => {
  function updateTooltips() {
    const tooltips = document.querySelectorAll<HTMLElement>(".legis-tooltip")
    tooltips.forEach(t => {
      const targetEl = document.querySelector<HTMLElement>(`#${t.id}-target`)
      if (!targetEl) return

      const arrowEl = t.querySelector<HTMLElement>(".legis-tooltip__arrow")
      const middleware = [offset(6), inline(), flip(), shift({ padding: 4 })]
      if (arrowEl) {
        middleware.push(arrow({ element: arrowEl, padding: 5 }))
      }

      const updateTooltip = async () => {
        const { x, y, placement, middlewareData } = await computePosition(targetEl, t, {
          // placement: 'top',
          middleware
        })
        Object.assign(t.style, {
          left: `${x}px`,
          top: `${y}px`
        })

        if (arrowEl) {
          const { x: arrowX, y: arrowY } = middlewareData.arrow as Coords

          const staticSide = {
            top: 'bottom',
            right: 'left',
            bottom: 'top',
            left: 'right'
          }[placement.split('-')[0]]

          Object.assign(arrowEl.style, {
            left: arrowX != null ? `${arrowX}px` : '',
            top: arrowY != null ? `${arrowY}px` : '',
            right: '',
            bottom: '',
            [staticSide as string]: '-4px'
          })
        }
      }

      function showTooltip() {
        t.style.display = 'block'
        updateTooltip()
      }

      function hideTooltip() {
        t.style.display = ''
      }

      [
        ['mouseenter', showTooltip],
        ['mouseleave', hideTooltip],
        ['focus', showTooltip],
        ['blur', hideTooltip],
      ].forEach(([event, listener]) => {
        targetEl.addEventListener(event as keyof HTMLElementEventMap, listener as any)
      })
    })
  }

  if (isClient) {
    app.provide('updateTooltips', updateTooltips)
  }
}