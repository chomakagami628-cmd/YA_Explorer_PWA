/**
 * YA Explorer PWA 専用API
 * 既存のWork Hub用Apps Scriptとは別プロジェクトに貼り付けてください。
 */
function doGet(e) {
  try {
    const url = String((e && e.parameter && e.parameter.url) || "").trim();
    if (!/^https:\/\/auctions\.yahoo\.co\.jp\/jp\/auction\/[A-Za-z0-9_-]+(?:[?#].*)?$/.test(url)) {
      return output_({ ok: false, error: "NOT_AUCTION_PAGE" });
    }

    const response = UrlFetchApp.fetch(url, {
      method: "get",
      followRedirects: true,
      muteHttpExceptions: true,
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1",
        "Accept-Language": "ja-JP,ja;q=0.9"
      }
    });
    if (response.getResponseCode() !== 200) throw new Error("HTTP_" + response.getResponseCode());

    const html = response.getContentText("UTF-8");
    const match = html.match(/<script[^>]+id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i);
    if (!match) throw new Error("NEXT_DATA_NOT_FOUND");

    const data = JSON.parse(decodeHtml_(match[1]));
    const item = data.props.initialState.item.detail.item;
    const rawShipping = data.props.pageProps.initialState.item.detail.item.chargeForShipping;
    const shippingMap = { winner: "buyer", seller: "seller" };

    // Work Hub v1.0.2内のYA Explorerと同じ構造・キー順。
    const info = {
      id: item.auctionId,
      title: item.title,
      startTime: item.timeForBrightTag.startTime,
      endTime: item.timeForBrightTag.endTime,
      isStore: item.seller.isStore,
      seller: {
        id: item.seller.aucUserId,
        fbAll: item.seller.rating.ult.allPoint,
        fbGood: item.seller.rating.ult.goodPoint,
        fbBad: item.seller.rating.ult.badPoint
      },
      shippingResponsible: Object.prototype.hasOwnProperty.call(shippingMap, rawShipping) ? shippingMap[rawShipping] : null
    };
    return output_({ ok: true, info: info });
  } catch (error) {
    console.error(error);
    return output_({ ok: false, error: "EXTRACTION_FAILED" });
  }
}

function decodeHtml_(text) {
  return String(text).replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function output_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
