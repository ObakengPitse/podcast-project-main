import {
  html,
  css,
  LitElement,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";
import { store, connect } from "../store.js";

class Component extends LitElement {
  static get properties() {
    return {
      single: { state: true },
    };
  }

  constructor() {
    super();

    this.disconnectStore = connect((state) => {
      if (this.single === state.single) return;
      this.single = state.single;
    });
  }

  disconnectedCallback() {
    this.disconnectStore();
  }

  static styles = css`
    h1 {
      color: purple;
      margin-left: 100px;
    }

    img {
      width: 100px;
      height: 100px;
      margin-left: 100px;
    }

    .season {
      margin-left: 100px;
    }
    .k {
      color: yellow;
    }

    button {
      background-color: skublue;
      width: 100px;
      font-weight: 300;
      margin: 80px 0 10px 100px;
    }
  `;

  render() {
    /**
     * @type {import('../types').show}
     */
    const show = this.single;
    if (!show) {
      return html`<div class="list"></div>`;
    }

    const backHandler = () => store.loadList();

    const seasons = show.seasons.map(({ episodes, title }) => {
      return html`
        <div class="season">
          <strong>${title}</strong>
          ${episodes.map(({ file, title: innerTitle }) => {
            return html`
              <div>
                <div class"ep">${innerTitle}</div>
                <div><audio controls>
                  <source src="${file}" />
                </audio></div>
              </div>
        </div>
            `;
          })}
        </div>
      `;
    });

    return html`
      <button clas="back" @click="${backHandler}">Back</button>
      <h1>${show.title || ""}</h1>
      <img src="${show.image}" />
      ${seasons}
    `;
  }
}

customElements.define("podcast-view-single", Component);
