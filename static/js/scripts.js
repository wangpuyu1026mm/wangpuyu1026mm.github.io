const content_dir = 'contents/';
const config_file = 'config.yml';
// 只保留需要渲染的区块（去掉 awards）
const section_names = ['home', 'publications'];

window.addEventListener('DOMContentLoaded', event => {
  // Activate Bootstrap scrollspy on the main nav element
  const mainNav = document.body.querySelector('#mainNav');
  if (mainNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: '#mainNav',
      offset: 74,
    });
  }

  // Collapse responsive navbar when toggler is visible
  const navbarToggler = document.body.querySelector('.navbar-toggler');
  const responsiveNavItems = [].slice.call(
    document.querySelectorAll('#navbarResponsive .nav-link')
  );
  responsiveNavItems.map(function (responsiveNavItem) {
    responsiveNavItem.addEventListener('click', () => {
      if (window.getComputedStyle(navbarToggler).display !== 'none') {
        navbarToggler.click();
      }
    });
  });

  // Yaml -> 填充文案
  fetch(content_dir + config_file)
    .then(response => response.text())
    .then(text => {
      const yml = jsyaml.load(text);
      Object.keys(yml).forEach(key => {
        try {
          const el = document.getElementById(key);
          if (el) el.innerHTML = yml[key];
        } catch (e) {
          console.log("Unknown id and value:", key, String(yml[key]));
        }
      });
    })
    .catch(error => console.log(error));

  // Marked
  marked.use({ mangle: false, headerIds: false });

  section_names.forEach(name => {
    const container = document.getElementById(name + '-md');
    // 若页面没有对应容器，直接跳过
    if (!container) return;

    fetch(content_dir + name + '.md')
      .then(response => response.text())
      .then(markdown => {
        const html = marked.parse(markdown);
        container.innerHTML = html;
      })
      .then(() => {
        // MathJax
        if (window.MathJax && MathJax.typeset) {
          MathJax.typeset();
        }
      })
      .catch(error => console.log(error));
  });
});

