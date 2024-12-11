function typeText(text, index, callback, elementId = "typing-text") {
    const typingElement = document.getElementById(elementId);
    if (index < text.length) {
        typingElement.innerHTML = text
            .substring(0, index + 1)
            .replace(/\n/g, "<br>");
        setTimeout(() => {
            typeText(text, index + 1, callback, elementId);
        }, 50);
    } else {
        callback();
    }
}

function showCard(cardNumber) {
    // Ẩn tất cả
    document.getElementById("card1-section").classList.add("d-none");
    document.getElementById("card2-section").classList.add("d-none");
    document.getElementById("card3-section").classList.add("d-none");
    document.getElementById("processing").classList.add("d-none");
    document.getElementById("summary-section").classList.add("d-none");
    document.getElementById("flow-section").classList.add("d-none");

    if (cardNumber === 1) {
        document.getElementById("card1-section").classList.remove("d-none");
    } else if (cardNumber === 2) {
        document.getElementById("card2-section").classList.remove("d-none");
    } else if (cardNumber === 3) {
        document.getElementById("card3-section").classList.remove("d-none");
    }
}

function createScenario(cardNumber) {
    // Hiện processing
    document.getElementById("processing").classList.remove("d-none");
    document.getElementById("summary-section").classList.add("d-none");
    document.getElementById("flow-section").classList.add("d-none");

    setTimeout(() => {
        // Tắt processing
        document.getElementById("processing").classList.add("d-none");
        document.getElementById("summary-section").classList.remove("d-none");

        let summaryText = "";
        let svgContent = "";

        if (cardNumber === 1) {
            summaryText = `実行する必要がある操作の内容を要約する
-納品書の確認: 納品書と注文書を照合する。数量、品名、品番などを確認する。
-入庫記録の入力: システムに納品内容を入力する（例: 商品名、数量、入庫日）。
-商品の検品: 商品に破損や不良品がないか検査する。
-保管場所の決定: 商品を保管する棚やエリアを決定する。
-作業記録の保存: システムに作業の進捗と完了情報を記録する。`;

            // Tạo SVG flow đơn giản (theo chiều dọc, màu cam #f7b066)
            svgContent = createFlowSVG(["納品書の確認","入庫記録の入力","商品の検品","保管場所の決定","作業記録の保存"], "#f7b066");

        } else if (cardNumber === 2) {
            summaryText = `変更内容の要約:
-追加: 「バーコードスキャン」と「温度・湿度チェック」ステップを導入。
-削除: 「保管場所の決定」をシステムによる自動化に変更。
-変更: 「入庫記録の入力」をバーコードスキャンによる自動入力へ改善。`;

            svgContent = createFlowSVG(["納品書の確認","バーコードスキャン","商品の検品","温度・湿度チェック（必要に応じて)","作業記録の保存"], "#f7b066", [1,3]);

        } else if (cardNumber === 3) {
            summaryText = `業務内容まとめ
航空券予約プロセスには、入力、検索、比較、予約、支払い、確認といった複数のステップが含まれています。`;

            svgContent = createFlowSVG(["航空券の条件入力","航空券検索","候補便の比較","予約情報の入力","支払い手続き","予約確認"], "#f7b066");
        }

        typeText(summaryText, 0, () => {
            document.getElementById("flow-section").classList.remove("d-none");
            const flowContainer = document.getElementById("flow-container");
            flowContainer.innerHTML = svgContent;
        });
    }, 2000);
}

function createFlowSVG(steps, color, greenIndices=[]) {
    let svgWidth = 400;
    let svgHeight = steps.length * 100;
    let startX = (svgWidth - 120)/2;
    let startY = 20;

    let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#0d6efd"></polygon>
        </marker>
    </defs>`;

    steps.forEach((step, index) => {
        let rectColor = color;
        if (greenIndices && greenIndices.includes(index)) {
            rectColor = "#C1E5F5";
        }

        let y = startY + index * 100;
        svg += `<rect x="${startX}" y="${y}" width="120" height="50" rx="10" fill="${rectColor}"></rect>`;

        // Kiểm tra nếu step là "温度・湿度チェック（必要に応じて)" thì chia làm 2 dòng
        if (step === "温度・湿度チェック（必要に応じて)") {
            svg += `
            <text x="${startX+60}" y="${y+20}" text-anchor="middle" font-size="14" fill="black">
                <tspan x="${startX+60}" dy="0em">温度・湿度チェック</tspan>
                <tspan x="${startX+60}" dy="1.2em">（必要に応じて)</tspan>
            </text>`;
        } else {
            // Bình thường giữ nguyên một dòng
            svg += `<text x="${startX+60}" y="${y+30}" text-anchor="middle" font-size="14" fill="black">${step}</text>`;
        }

        // vẽ mũi tên giữa step này và step kế tiếp
        if (index < steps.length - 1) {
            let arrowStartX = startX + 60;
            let arrowStartY = y + 50;
            let arrowEndX = startX + 60;
            let arrowEndY = y + 100;
            svg += `<line x1="${arrowStartX}" y1="${arrowStartY}" x2="${arrowEndX}" y2="${arrowEndY}" stroke="#0d6efd" stroke-width="2" marker-end="url(#arrowhead)" />`
        }
    });

    svg += `</svg>`;

    return svg;
}


function downloadScenarioSVG() {
    const flowContainer = document.getElementById("flow-container");
    if (!flowContainer) return;
    const svgElement = flowContainer.querySelector("svg");
    if (!svgElement) return;

    const svgContent = svgElement.outerHTML;
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "scenario.svg";
    link.click();
}
