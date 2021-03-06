const LOG_SHEET_ID = "1UV72D1Fd2lap-FRelQJRZubbojY10Z33fk_p_BgA4QQ"
const SPD_SHEET_ID = "1DQnt3DCTWiYBdnxUimxWxuwnjgYizFGK6hkC4isWtSo"

function doGet(e)
{
  console.log(e);
  
  // getEmail()、getUserLoginId()はスクリプト実行者とスクリプトオーナーのドメインが同じ場合のみ動作する
  // 別ドメインのときはセキュリティ上、取得できない
  const userEmail = Session.getActiveUser().getEmail();
  
  // IDを指定してスプレッドシートを取得
  const logSheet = SpreadsheetApp.openById(LOG_SHEET_ID); 
  
  // シート名「log」に書き込む
  logSheet.getSheetByName('log').appendRow([new Date(), userEmail, 'doGet(e)', e]); 
  
  //index.htmlファイルからHtmlTemplateオブジェクトを生成
  const template = HtmlService.createTemplateFromFile('index');
  
  template.loginUser = userEmail;
  
  // evaluateメソッドでHtmlOutputオブジェクトを生成
  return template.evaluate().setTitle('データ取得');
}

/**
 * select の optionのhtmlタグを取得
 */
function getHtmlOptions(){
  var sheets = SpreadsheetApp.openById(SPD_SHEET_ID).getSheets();
  
  //foreachで流す
  let htmlOptions;
  for (i=0;i<sheets.length;i++) {
    if(!sheets[i].isSheetHidden()){
      var name = sheets[i].getSheetName();
      htmlOptions += `<option value="${name}">${name}</option>`
    }
  }
  console.warn(htmlOptions);
  return htmlOptions;
}


function getBae64Image(id) {
  const file = DriveApp.getFileById(id);
  const data = file.getBlob().getBytes();
  return Utilities.base64Encode(data);
}

/**
 * コピーボタン実装
 * HTML内に記述しないと動かなかったのでコメントアウト
 */
// function copyToClipboard(index) {
//     // コピー対象をJavaScript上で変数として定義する
//     var copyTarget = document.getElementById("form"+index);

//     // コピー対象のテキストを選択する
//     copyTarget.select();

//     // 選択しているテキストをクリップボードにコピーする
//     document.execCommand("Copy");

//     alert("Copied: " + copyTarget.value);
// }

/**
 * 指定した年月とユーザーからカレンダーを取得
 */
function getSpd(e){
  
  console.log(e);
  
  // getEmail()、getUserLoginId()はスクリプト実行者とスクリプトオーナーのドメインが同じ場合のみ動作する
  // 別ドメインのときはセキュリティ上、取得できない
  const userEmail = Session.getActiveUser().getEmail();
  
  // IDを指定してスプレッドシートを取得
  const logSheet = SpreadsheetApp.openById(LOG_SHEET_ID); 
  
  // シート名「log」に書き込む
  logSheet.getSheetByName('log').appendRow([new Date(), userEmail, 'getSpd(e)', e]); 
  
  const spdSheet = SpreadsheetApp.openById(SPD_SHEET_ID); 
  
  // 表示用のテーブルを作成する
  let html = '';
  
  let sheet = spdSheet.getSheetByName(e.search_key_p);
  let id = e.search_key_n;
  
  // 指定したyyyymmのシートが存在しないとき
  if(!sheet){
    return '対象のシートありません！';
  }

  //master 取得
  let rowStartIndex = 2;
  let colStartIndex = 1;
  let data = sheet.getRange(rowStartIndex, colStartIndex, sheet.getLastRow()-rowStartIndex+1, sheet.getLastColumn()).getValues();

  let view = [];

  for (i=0;i<data.length;i++) {
    if(data[i][2]==id){
        view = data[i]
    }
  }

  logSheet.getSheetByName('log').appendRow([new Date(), userEmail, 'view', JSON.stringify(view)]); 
  
  if (!view.length) {
    return '対象の端末はありません！';
  } else {

    html += `
    <script>
    function copyToClipboard(index) {
      var copyTarget = document.getElementById("form"+index);
      return navigator.clipboard.writeText(copyTarget.value).then(function() {
        swal("Copied!", copyTarget.value, "success");
      }).catch(function(error) {
        swal("Error", copyTarget.value, "error");
      })
    }
    </script>
    `;

    html += `
    <div class="row">
      <div class="col-sm-8">
        <div class="sm-form">
          <label for=form0" class="active">
            管理番号
          </label>
          <p id="form0">
            ${view[0]}
          </p>

        </div>
      </div>
      <div class="col-sm-8">
        <div class="sm-form">
          <label for=form1" class="active">
            学校名
          </label>
          <p id="form1">
            ${view[1]}
          </p>
        </div>
      </div>
      <div class="col-sm-8">
        <div class="sm-form">
          <label for=form3" class="active">
            端末名
            <button type="button" class="btn col" onclick="copyToClipboard(3)" data-toggle="tooltip" data-placement="top" title="Copy Device Name">
              <i class="fas fa-clipboard"></i>
            </button>
          </label>
          <input type="text" id="form3" class="form-control" readonly value=${view[3]}>
        </div>
      </div>

      <div class="col-sm-8">
        <div class="sm-form">
          <label for=form14" class="active">
            MobiConnect アカウントID
            <button type="button" class="btn col" onclick="copyToClipboard(14)" data-toggle="tooltip" data-placement="top" title="MDM Account ID">
              <i class="fas fa-clipboard"></i>
            </button>
          </label>
          <input type="text" id="form14" class="form-control" readonly value=${view[14]}>
        </div>
      </div>
      <div class="col-sm-8">
        <div class="sm-form">
          <label for=form15" class="active">
            端末登録用ユーザID
            <button type="button" class="btn col" onclick="copyToClipboard(15)" data-toggle="tooltip" data-placement="top" title="User ID for registration of MDM">
              <i class="fas fa-clipboard"></i>
            </button>
          </label>
          <input type="text" id="form15" class="form-control" readonly value=${view[15]}>
        </div>
      </div>
      <div class="col-sm-8">
        <div class="sm-form">
          <label for=form16" class="active">
            端末登録用パスワード
            <button type="button" class="btn col" onclick="copyToClipboard(16)" data-toggle="tooltip" data-placement="top" title="Password for registration of MDM">
              <i class="fas fa-clipboard"></i>
            </button>
          </label>
          <input type="text" id="form16" class="form-control" readonly value=${view[16]}>
        </div>
      </div>
    </div>

    `;

    if(view[4] != ""){
      html += `
        <div class="row">
          <div class="col-sm-8">
            <div class="sm-form">
              <label for=form4" class="active">
                パスコード(TouchID)
              </label>
              <input type="text" id="form4" class="form-control" value=${view[4]} readonly>
            </div>
          </div>
        </div>
        `;
    }

    if(view[5] != "" || view[6] != "") {
      var appleId = view[5]+view[6];
      html += `
        <div class="row">
          <div class="col-sm-8">
            <div class="sm-form">
              <label for=form56" class="active">
                AppleID
              <button type="button" class="btn col" onclick="copyToClipboard(56)" data-toggle="tooltip" data-placement="top" title="Copy AppleID">
                <i class="fas fa-clipboard"></i>
              </button>
              </label>
              <input type="text" id="form56" class="form-control" readonly value=${appleId}>
            </div>
          </div>
          <div class="col-sm-8">
            <div class="sm-form">
              <label for=form7" class="active">
                AppleID パスワード
                <button type="button" class="btn col" onclick="copyToClipboard(7)" data-toggle="tooltip" data-placement="top" title="Copy AppleID PassWord">
                  <i class="fas fa-clipboard"></i>
                </button>
              </label>
              <input type="text" id="form7" class="form-control" readonly value=${view[7]}>
            </div>
          </div>
          <div class="col-sm-8">
            <div class="sm-form">
              <label for=form8" class="active">
                AppleID 仮パスワード
                <button type="button" class="btn col" onclick="copyToClipboard(8)" data-toggle="tooltip" data-placement="top" title="Copy AppleID TempPass">
                  <i class="fas fa-clipboard"></i>
                </button>
              </label>
              <input type="text" id="form8" class="form-control" readonly value=${view[8]}>
            </div>
          </div>
        </div>
        `;
    }

    if(view[9] != ""){
      html += `
        <div class="row">
          <div class="col-sm-8">
            <div class="sm-form">
              <label for=form9" class="active">
                固定IP
                <button type="button" class="btn col" onclick="copyToClipboard(9)" data-toggle="tooltip" data-placement="top" title="Copy IP">
                  <i class="fas fa-clipboard"></i>
                </button>
              </label>
              <input type="text" id="form9" class="form-control" readonly value=${view[9]}>
            </div>
          </div>
          <div class="col-sm-8">
            <div class="sm-form">
              <label for=form10" class="active">
                サブネットマスク
                <button type="button" class="btn col" onclick="copyToClipboard(10)" data-toggle="tooltip" data-placement="top" title="Copy subnetmask">
                  <i class="fas fa-clipboard"></i>
                </button>
              </label>
              <input type="text" id="form10" class="form-control" readonly value=${view[10]} >
            </div>
          </div>
          <div class="col-sm-8">
            <div class="sm-form">
              <label for=form11" class="active">
                ルーター
                <button type="button" class="btn col" onclick="copyToClipboard(11)" data-toggle="tooltip" data-placement="top" title="Copy Rooter">
                  <i class="fas fa-clipboard"></i>
                </button>
              </label>
              <input type="text" id="form11" class="form-control" readonly value=${view[11]}>
            </div>
          </div>
          <div class="col-sm-8">
            <div class="sm-form">
              <label for=form12" class="active">
                DNS1
                <button type="button" class="btn col" onclick="copyToClipboard(12)" data-toggle="tooltip" data-placement="top" title="Copy DNS1">
                  <i class="fas fa-clipboard"></i>
                </button>
              </label>
              <input type="text" id="form12" class="form-control" readonly value=${view[12]}>
            </div>
          </div>
          <div class="col-sm-8">
            <div class="sm-form">
              <label for=form13" class="active">
                DNS2
                <button type="button" class="btn col" onclick="copyToClipboard(13)" data-toggle="tooltip" data-placement="top" title="Copy DNS2">
                  <i class="fas fa-clipboard"></i>
                </button>
              </label>
              <input type="text" id="form13" class="form-control" readonly value=${view[13]}>
            </div>
          </div>
        </div>
        `;
      }

    if(view[17] != ""){
      html += `
      <div class="row">
        <div class="col-sm-8">
          <div class="sm-form">
            <label for=form1" class="active">
              検証URL(1)
            </label>
            <p id="form17">
              <a href="${view[17]}" target="_blank" rel="noopener">${view[17]}</a>
           </p>
          </div>
        </div>
      </div>
        `;
      }
    if(view[18] != ""){
      html += `
      <div class="row">
        <div class="col-sm-8">
          <div class="sm-form">
            <label for=form1" class="active">
              検証URL(2)
            </label>
            <p id="form18">
              <a href="${view[18]}" target="_blank" rel="noopener">${view[18]}</a>
            </p>
          </div>
        </div>
      </div>
        `;
      }
    
    return html;
      
  }
}
