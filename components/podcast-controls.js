import {
  html,
  LitElement,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";
import { store, connect } from "../store.js";

class Component extends LitElement {
  static get properties() {
    return {
      sorting: {},
      search: {},
    };
  }

  constructor() {
    super();

    this.disconnectStore = connect((state) => {
      if (this.sorting !== state.sorting) {
        this.sorting = state.sorting;
      }
      if (this.search !== state.search) {
        this.search = state.search;
      }
    });
  }

  disconnectedCallback() {
    this.disconnectStore();
  }

  static styles = css`
    .nav {
      margin: 50px;
    }
  `;

  render() {
    const changeHandler = (event) => {
      store.changeSorting(event.target.value);
    };

    const inputHandler = (event) => {
      store.changeSearch(event.target.value);
    };

    return html`
      <div style="color: #1d84b5; font-weight: 400;" class="nav">
        <label>
          <span class="search">Search</span>
          <input
            style="border: 1px solid grey; border-radius: 5px; height: 25px"
            @input="${inputHandler}"
            placeholder="search"
            value="${this.search}"
          />
        </label>

        <label>
          Sorting
          <select @change="${changeHandler}">
            <option
              style="border: 1px solid grey; border-radius: 5px; height: 25px"
              value="a-z"
              .selected="${this.sorting === "a-z"}"
            >
              A - Z
            </option>
            <option value="z-a" .selected="${this.sorting === "z-a"}">
              Z - A
            </option>
            <option
              value="oldest-latest"
              .selected="${this.sorting === "oldest-latest"}"
            >
              Oldest - Latest
            </option>
            <option
              value="latest-oldest"
              .selected="${this.sorting === "latest-oldest"}"
            >
              Latest - Oldest
            </option>
          </select>
        </label>
      </div>
    `;
  }
}

customElements.define("podcast-controls", Component);
