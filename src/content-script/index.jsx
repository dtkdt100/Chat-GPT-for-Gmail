import 'github-markdown-css'
import { render } from 'preact'
import { onChanged, getUserConfig } from '../config'
import ChatGPTCard from './ChatGPTCard'
import './styles.scss'

import { SUGGESTIONS_BOX, REWRITE_DIALOG } from './consts' 

enable = true;
selected_text = '';

function getSelectedText() {
  var text = "";
  if (typeof window.getSelection != "undefined") {
      text = window.getSelection().toString();
  } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
      text = document.selection.createRange().text;
  }
  return text;
}

function createBaseElement(elementType='div', className) {
  const container = document.createElement(elementType)
  if (className != "no") {
    container.className = className;
  }
  return container;
}

function getLastTextPosition(textElement) {
  if (textElement.childElementCount == 0) {
    textElement.innerHTML = "<div>"+textElement.innerHTML+"</div>";
  }
  return textElement.childNodes[textElement.childNodes.length-1].getBoundingClientRect();
}

function getChatGPTSvgLogo() {
  const container = document.createElement('button')
  container.innerHTML = "HELLO";
  return container;
}



function setChatGPTButton(container, textDialog) {

  var pos = textDialog.getBoundingClientRect();
  container.style.left = (pos.left+20)+"px";
  container.style.bottom = (window.innerHeight-pos.bottom+5)+"px";
}

function setContainerPosUnderText(container, textDialog) {
  var pos = getLastTextPosition(textDialog);
  container.style.top = (Math.ceil(pos.top+pos.height))+"px";
  container.style.left = (pos.left)+"px";
  container.style.width = "330px";
  container.style.position = "absolute";
}

function highLightText(textElement) {
  textElement.focus();
  var sel = window.getSelection();
  sel.selectAllChildren(textElement);
}

function listenToMouseEvent(event) {

   var elementExists2 = document.getElementsByClassName(SUGGESTIONS_BOX);
  // const bodyInput = document.querySelector('.Am.Al.editable');
  // bodyInput.innerHTML = document.getElementsByClassName(REWRITE_DIALOG)[0].innerHTML;
  // elementExists2[0].remove();

  if (elementExists2.length > 0) {
    var pos = elementExists2[0].getBoundingClientRect()

    xMin = pos.x;
    yMin = pos.y;
    XMax = pos.right;
    YMax = pos.bottom;
    XMouse = event.clientX;
    YMouse = event.clientY;
    if (document.getElementsByClassName("chat-gpt-button").length > 0){
      var pos2 = document.getElementsByClassName("chat-gpt-button")[0].getBoundingClientRect()
      xMin2 = pos2.x;
      yMin2 = pos2.y;
      XMax2 = pos2.right;
      YMax2 = pos2.bottom;
  
      if (!(XMouse >= xMin && XMouse <= XMax && YMouse >= yMin && YMouse <= YMax) &&
       !(XMouse >= xMin2 && XMouse <= XMax2 && YMouse >= yMin2 && YMouse <= YMax2)) {
        elementExists2[0].remove();
        
      }
    }
    

  }

}

function changed(changes, area) {
  enable = changes["on"].newValue==1;
}

function removeChatGPTButton() {
  var elementExists = document.getElementsByClassName("chat-gpt-button");
  if (elementExists.length > 0 && document.activeElement != elementExists[0]) {
    elementExists[0].remove();
  }
}

async function run() {

  const div = document.body;

  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(async function(mutation) {

    if (!enable) {
      removeChatGPTButton()
    }
    else {
      const currentUrl = window.location.href ;
      if (currentUrl.startsWith("https://mail.google.com/mail/u/0/#inbox?compose=")) {
          const bodyInput = document.querySelector('.Am.Al.editable');


          const observer = new MutationObserver(function(mutations) {
            mutations.forEach(async function(mutation) {

              if (enable) {

                var elementExists = document.getElementsByClassName("chat-gpt-button");
                if (elementExists != null) {
                  if (!elementExists.length > 0 && document.activeElement == bodyInput) {
                    const container = createBaseElement('button', "chat-gpt-button");

                    container.innerHTML = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve"> <style type="text/css"> .st0{fill:#d665be;} .st1{fill:#FFFFFF;} </style> <defs> </defs> <circle class="st0" cx="12" cy="12" r="12"/> <g> <path class="st1" d="M11.3,11.8c-0.4,0-0.7-0.3-0.7-0.7c0-0.4,0.3-0.7,0.6-0.7c-0.2-0.2-0.5-0.3-0.8-0.3c-0.9,0-1.6,1-1.6,2.3 c0,0.4,0.1,0.8,0.2,1.1c0.1-0.2,0.2-0.3,0.4-0.3c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5c0,0,0,0,0,0c0.3,0.3,0.6,0.5,1,0.5 c0.9,0,1.6-1,1.6-2.3c0-0.3,0-0.6-0.1-0.9C11.7,11.7,11.5,11.8,11.3,11.8z"/> <path class="st1" d="M16.4,12.2c-0.2,0-0.4-0.2-0.4-0.4s0.2-0.4,0.4-0.4c0,0,0,0,0,0c-0.1-0.1-0.3-0.2-0.5-0.2 c-0.5,0-0.9,0.6-0.9,1.3c0,0.2,0,0.4,0.1,0.6c0.1-0.1,0.1-0.1,0.3-0.1c0.2,0,0.3,0.1,0.3,0.3c0,0.2-0.1,0.3-0.3,0.3 c0.1,0.1,0.3,0.2,0.5,0.2c0.5,0,0.9-0.6,0.9-1.3c0-0.2,0-0.3-0.1-0.4C16.7,12.1,16.6,12.2,16.4,12.2z"/> <path class="st1" d="M19.9,10.2c0-0.7-0.1-1.4-0.5-1.9c-0.6-1-2-1.1-3-1.3c-1.1-0.2-2.1-0.3-3.2-0.4l-0.8-1.5 c0.3-0.2,0.4-0.5,0.4-0.9c0-0.6-0.5-1.1-1.1-1.1c-0.6,0-1.1,0.5-1.1,1.1c0,0.6,0.4,1.1,1,1.1l-0.1,1.1c-0.1,0-0.3,0-0.4,0 c-1-0.1-2-0.2-3-0.2c-1.1,0-2.4,0.1-3.1,1.1C4.8,7.5,4.7,7.7,4.6,7.9C4.5,8.4,4.4,9,4.4,9.5c0,0.1,0.3,5.2,0.3,5.2 c0.1,0.4,0.1,0.8,0.2,1.2c0.2,1.1,0.6,2.1,1.8,2.2c2,0.2,4.1,0.1,6-0.1c0.9-0.1,1.9-0.2,2.8-0.4c0,0,0,0,0,0 c0.3-0.1,0.6,0.1,0.8,0.4c0.2,0.4,0.2,0.8,0.1,1.2c0,0.2,0.2,0.3,0.3,0.2c0.4-0.2,0.7-0.5,1-0.7c0.6-0.5,1.1-1.2,1.5-1.9 c0.4-0.8,0.5-1.8,0.6-2.7c0,0,0-1.3,0-1.5C19.9,12.8,20.1,10.3,19.9,10.2z M11.5,3.7c0-0.2,0.2-0.4,0.4-0.4c0.2,0,0.4,0.2,0.4,0.4 s-0.2,0.4-0.4,0.4C11.7,4.2,11.5,4,11.5,3.7z M18.7,10.7c0,0.9,0,1.7,0,2.6c0,0.4,0,0.8-0.1,1.2c-0.1,0.9-0.2,1.2-1.1,1.4 c-2.5,0.3-4.9,0.7-7.4,0.7c-0.6,0-1.1,0-1.7,0c-0.1,0-0.2,0-0.4-0.1c-0.1-0.1-0.2-0.2-0.3-0.4c-0.6-1.9-0.8-4-0.6-6 c0-0.5,0-1.1,0.3-1.5c0.4-0.7,2.1-0.3,2.7-0.3c0.4,0,0.8,0,1.3,0.1c0.2,0,0.3,0.1,0.4,0.2c0.2,0.3,0.4,0.7,0.5,0.7 c0.1,0.1,1.9,0.2,2.3,0.2c0.1,0,0.1,0,0.1-0.1L14.9,9c0.1-0.2,0.3-0.3,0.5-0.2c0.7,0.1,1.4,0.2,2.2,0.3c0.5,0.1,0.9,0.3,1,0.8 C18.7,10.2,18.7,10.4,18.7,10.7z"/> </g> </svg>';

                    container.onclick = async () => {

                      
                      const container2 = document.createElement('div'); 
                      container2.className = SUGGESTIONS_BOX;

                      setContainerPosUnderText(container2, bodyInput);
                      highLightText(bodyInput);

                      selected_text = getSelectedText();


                      const container3 = document.createElement('div');
                      container3.className = REWRITE_DIALOG;
                      container2.onclick = () => {
                        var elementExists2 = document.getElementsByClassName(SUGGESTIONS_BOX);
                        bodyInput.innerHTML = document.getElementsByClassName(REWRITE_DIALOG)[0].innerHTML;
                        elementExists2[0].remove();
                        //listenToMouseEvent();
                      }
                      


                      container2.appendChild(container3);

                      render(
                        <ChatGPTCard question={"complete my email. write only the email: \n" + bodyInput.innerHTML} triggerMode={'always'} />,
                        container3,
                      );

                      document.body.appendChild(container2);

                      
                    };
                    const father = createBaseElement('div', "no");
                    father.setAttribute("style", "position: absolute; z-index: 20000000000;");

                    const child = createBaseElement('div', "no");
                    child.setAttribute("style", "display: flex; column-gap: 4px;");

                    

                    father.appendChild(child);
                    child.appendChild(container);
                    setChatGPTButton(father, bodyInput);

                    document.body.appendChild(father);

                  }
                  
                  if (elementExists.length > 0 && document.activeElement != bodyInput) {
                    removeChatGPTButton();
                  }

                  
                }

                // var elementExists2 = document.getElementsByClassName(SUGGESTIONS_BOX);
                // if (elementExists2.length > 0 && document.activeElement != bodyInput && selected_text != getSelectedText()) {
                //   elementExists2[0].remove();
                // }                
              }

              
              
            });
          });

          observer.observe(bodyInput, {
            attributes: true,
            childList: true,
            characterData: true
          });
         
          
          document.addEventListener("click", listenToMouseEvent);
      }
    }
      
    });
    
  }); //div.kix-rotatingtilemanager-content
  
  observer.observe(div, {
    attributes: true,
    childList: true,
    characterData: true
  });

  onChanged(changed)

  


}

async function getConfigFirst() {
  enable = (await getUserConfig()).on==1;
  run();
}

getConfigFirst();
