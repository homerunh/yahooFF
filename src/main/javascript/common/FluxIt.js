import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';


function _isMounted(component) {
  try {
    ReactDOM.findDOMNode(component);
    return true;
  } catch(e) {
    return false;
  }
}


/**
 * An ES7 Decorator for initializing a React Component with the Flux architecture
 * so that any changes to a store will try send changes to this component and
 * optional api calls are called in the component will mount.
 *
 * @param stateFunc a function used to generate the state of the component
 * @param Stores a list or a single Store to bind to the component
 * @param apiFuncs an optional single or list of API calls to call in the componentWillMount
 */
export function init(stateFunc, Stores, apiFuncs) {
  return Component => {
    if(!Stores) {
      throw new Error(`Attempted to flux a component without any stores. See the component ${Component}`);
    }

    if(!(Stores instanceof Array)) {
      Stores = [Stores];
    }

    class FluxIt extends Component {
      constructor(props) {
        super(props);

        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = stateFunc(props);
      }

      componentWillMount() {
        if(!apiFuncs) {
          return;
        }

        if(!(apiFuncs instanceof Array)) {
          apiFuncs = [apiFuncs];
        }

        apiFuncs.forEach(f => {
          f(Object.assign({}, this.props, this.state));
        });
      }

      componentDidMount() {
        Stores.forEach(store => {
          if(store instanceof Function) {
            store(this.props).addChangeListener(this._handleStoresChanged);
          } else {
            store.addChangeListener(this._handleStoresChanged);
          }
        });
      }

      componentWillUnmount() {
        Stores.forEach(store => {
          if(store instanceof Function) {
            store(this.props).removeChangeListener(this._handleStoresChanged);
          } else {
            store.removeChangeListener(this._handleStoresChanged);
          }
        });
      }

      render() {
        return <Component {...this.props} {...this.state} />;
      }

      _handleStoresChanged = () => {
        if(_isMounted(this)) {
          this.setState(stateFunc(this.props));
        }
      }
    }

    return FluxIt;
  };
}

/**
 * An ES7 decorator for "lazy loading" an object from api calls and a passed in id
 *
 * @param {object|Array.<object>} Stores the stores to watch and call '.get' on
 * @param {function|Array.<function>} fetchFunctions the functions to pass the id and current state object into
 * @param {string:Array.<string>} dataKeys the dataKeys to use for creating the state
 * @param {func} stateFunc? an optional state func to use
 */
export function lazyLoad(Stores, fetchFunctions, dataKeys, stateFunc) {
  if(!Stores) {
    throw new Error(`Attempted to flux a component without any stores. See the component ${Component}`);
  }

  if(!(Stores instanceof Array)) {
    Stores = [Stores];
  }

  if(!(dataKeys instanceof Array)) {
    dataKeys = [dataKeys];
  }

  if(!(fetchFunctions instanceof Array)) {
    fetchFunctions = [fetchFunctions];
  }

  if(Stores.length !== dataKeys.length) {
    throw new Error(`Lazy loading with the incorrect number of dataKeys. See component ${Component}`);
  }

  const updateState = props => {
    let state = (stateFunc && stateFunc(props)) || {};

    Stores.forEach((Store, i) => {
      state[dataKeys[i]] = Store.get(props.id);
    });

    return state;
  };

  const apiFuncs = context => {
    fetchFunctions.forEach((api, i) => {
      api(context.id, context[dataKeys[i]]);
    });
  };

  return init(updateState, Stores, apiFuncs);
}

