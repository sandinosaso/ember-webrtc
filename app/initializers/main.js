export function initialize(registry, app) {
  // application.inject('route', 'foo', 'service:foo');
  window.app = app;
}

export default {
  name: 'main',
  initialize
};
