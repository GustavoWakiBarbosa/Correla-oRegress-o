<template>
  <!-- <NavBar />
  <NavDrawer /> -->
  <Correlacao />
</template>

<script setup lang="ts">
import gsap from "gsap";
import { useHead } from "@vueuse/head";
const scrollToId = <Function>inject("scrollToId");

useHead({
  title: "EDX",
  meta: [
    {
      name: `description`,
      content: `Sua parceira estratégica na transformação digital`,
    },
  ],
});

const getParameterByName = (
  name: any,
  url?: any
): string | null | undefined => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  console.log("results:", results);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

const redirect = getParameterByName("redirect");
if (redirect) {
  setTimeout(() => {
    scrollToId("#" + redirect);
  }, 1000);
}

onMounted(async () => {
  const prefersReducedMotionQuery = window.matchMedia(
    `(prefers-reduced-motion: reduce)`
  );

  if (!prefersReducedMotionQuery?.matches) {
    function animateFrom(elem: HTMLElement, direction?: number) {
      direction = direction || 1;
      let x = 0,
        y = direction * 100;
      if (elem.classList.contains("gs_reveal_fromLeft")) {
        x = -100;
        y = 0;
      } else if (elem.classList.contains("gs_reveal_fromRight")) {
        x = 100;
        y = 0;
      }
      elem.style.transform = "translate(" + x + "px, " + y + "px)";
      elem.style.opacity = "0";
      gsap.fromTo(
        elem,
        { x: x, y: y, autoAlpha: 0 },
        {
          duration: 1.25,
          x: 0,
          y: 0,
          autoAlpha: 1,
          ease: "power2",
          overwrite: "auto",
        }
      );
    }

    function hide(elem: gsap.DOMTarget) {
      gsap.set(elem, { autoAlpha: 0 });
    }

    const ScrollTrigger = (await import("gsap/ScrollTrigger")).ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
    const elems: Array<gsap.DOMTarget> = gsap.utils.toArray(".gs_reveal");
    elems.forEach(function (elem) {
      hide(elem); // assure that the element is hidden when scrolled into view

      ScrollTrigger.create({
        trigger: elem,
        onEnter: function () {
          animateFrom(elem as HTMLElement);
        },
        onEnterBack: function () {
          animateFrom(elem as HTMLElement, -1);
        },
        onLeave: function () {
          hide(elem);
        }, // assure that the element is hidden when scrolled into view
        onLeaveBack: function () {
          hide(elem);
        },
      });
    });
  }
});
</script>

<route lang="yaml">
meta:
  layout: default
</route>
