import React, { Component, PropsWithChildren, ReactNode } from "react";
import $ from "jquery";
import Iframe from 'react-iframe'

type Props = {}

type State = {}

class Editor extends Component<PropsWithChildren<Props>, State> {

  getGeneratedPageURL = ({ html, css, js }: any) => {
    const getBlobURL = (code: BlobPart, type: string) => {
      const blob = new Blob([code], { type })
      return URL.createObjectURL(blob)
    }

    const cssURL = getBlobURL(css, 'text/css')
    const jsURL = getBlobURL(js, 'text/javascript')

    const source = `
      <html>
        <head>
          ${css && `<link rel="stylesheet" type="text/css" href="${cssURL}" />`}
          ${js && `<script src="${jsURL}"></script>`}
        </head>
        <body>
          ${html || ''}
        </body>
      </html>
    `

    return getBlobURL(source, 'text/html')
  }

  injectIframeContent = () => {

    const fetchHtmlData = async () => {
      const res = await fetch('https://jsonp.afeld.me/?url=https://jsonview.com/example.json');
      const html = await res.text()
      return html;
      // return JSON.stringify()
    }

    const injectScript = () => `
      fetch('https://jsonp.afeld.me/?url=https://stackoverflow.com')  
        .then(response => response.text())  
        .then(html => {
          // console.log(html);
          document.body.innerHTML = html;

          $('#myIFrame').children().mouseover(function (e) {
            $(".hova").removeClass("hova");
            $(e.target).addClass("hova");
            return false;
          }).mouseout(function (e) {
            $(window).removeClass("hova");
          });
        })
    `;

    const injectCss = () => `
    .hova {
      background-color: pink !important;
    }
    `;

    return this.getGeneratedPageURL({
      html: fetchHtmlData(),
      css: injectCss(),
      js: injectScript()
    })
  }

  render() {
    const { children } = this.props;

    return (
      <iframe style={{ height: "100%", width: "100%" }} id="myIFrame" src={this.injectIframeContent()} />
    )
  }
}

export default Editor;