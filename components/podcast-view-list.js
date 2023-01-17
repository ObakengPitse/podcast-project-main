import {
  html,
  css,
  LitElement,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";
import { store, connect } from "../store.js";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

class Component extends LitElement {
  static get properties() {
    return {
      previews: { state: true },
      sorting: { state: true },
      search: { state: true },
    };
  }

  constructor() {
    super();

    this.disconnectStore = connect((state) => {
      if (this.previews !== state.previews) {
        this.previews = state.previews;
      }
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
    li {
      border: 1px solid var(--primary-blue);
    }

    .list {
      display: flex;
      flex-wrap: wrap;
      margin: 10px 0 0 150px;
    }

    .show {
      width: 200px;
      margin: 5px 5px 5px 5px;
    }

    h2 {
      margin: 0;
    }
  `;

  render() {
    /**
     * @type {import('../types').preview[]}
     */
    const previews = this.previews;

    const filteredPreviews = previews.filter((item) => {
      if (!this.search) return true;
      return item.title.toLowerCase().includes(this.search.toLowerCase());
    });

    const sortedPreviews = filteredPreviews.sort((a, b) => {
      if (this.sorting === "a-z") return a.title.localeCompare(b.title);
      if (this.sorting === "z-a") return b.title.localeCompare(a.title);

      const dateA = new Date(a.updated).getTime();
      const dateB = new Date(b.updated).getTime();

      if (this.sorting === "oldest-latest") return dateA - dateB;
      if (this.sorting === "latest-oldest") return dateB - dateA;

      throw new Error("Invalid sorting");
    });

    const list = sortedPreviews.map(({ title, id, updated, image }) => {
      const date = new Date(updated);
      const day = date.getDate();
      const month = MONTHS[date.getMonth() - 1];
      const year = date.getFullYear();

      const clickHandler = () => store.loadSingle(id);

      return html`
        <div class="show">
          <img class="showImage" src="${image}" width="200px" />
          <div>
            <button
              style="background-color:dodgerblue;
              border: 1px solid white; cursor: pointer;
              overflow: hidden; color: white; width: 200px;"
              @click="${clickHandler}"
            >
              ${title}
            </button>
          </div>
          <div>Updated: ${day} ${month} ${year}</div>
        </div>
      `;
    });

    return html`
      <div class="head"><h2>Podcast List</h2></div>
      <podcast-controls></podcast-controls>
      ${list.length > 0
        ? html`<div class="list">${list}</div>`
        : html`<div>No matches</div>`}
    `;
  }
}

customElements.define("podcast-view-list", Component);
