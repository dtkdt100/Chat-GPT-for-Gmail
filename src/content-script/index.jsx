import 'github-markdown-css'
import { render } from 'preact'
import { onChanged, getUserConfig } from '../config'
import { NewMessageObserver } from './new_message_observer'
import ChatGPTCard from './ChatGPTCard'
import './styles.scss'

import { BUTTON, SUGGESTIONS_BOX, REWRITE_DIALOG, 
  NEW_MESSAGE_INPUT, ERROR_CLASS_NAME, 
  URL_PATTERN, REPLAY_MESSAGE_INPUT, SUBJECT_INPUT } from './consts' 

const COMPLETE_EMAIL_RULE = "complete my email. write only the email";
const COMPLETE_SUBJECT_RULE = "write the subject at the top with enter";

let enableChatGPTSuggestion = true;
let subjectCompletion = true;
let observer_on_new_messages = []; // list of NewMessageObserver

function createBaseElement(elementType = "div", className) {
  const container = document.createElement(elementType);
  if (className !== "no") {
    container.className = className;
  }
  return container;
}

function getLastTextPosition(textElement) {
  if (textElement.childElementCount === 0) {
    textElement.innerHTML = `<div>${textElement.innerHTML}</div>`;
  }
  return textElement.lastChild.getBoundingClientRect();
}

function getChatGPTSvgLogo() {
  return '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve"> <style type="text/css"> .st0{fill:#d665be;} .st1{fill:#FFFFFF;} </style> <defs> </defs> <circle class="st0" cx="12" cy="12" r="12"/> <g> <path class="st1" d="M11.3,11.8c-0.4,0-0.7-0.3-0.7-0.7c0-0.4,0.3-0.7,0.6-0.7c-0.2-0.2-0.5-0.3-0.8-0.3c-0.9,0-1.6,1-1.6,2.3 c0,0.4,0.1,0.8,0.2,1.1c0.1-0.2,0.2-0.3,0.4-0.3c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5c0,0,0,0,0,0c0.3,0.3,0.6,0.5,1,0.5 c0.9,0,1.6-1,1.6-2.3c0-0.3,0-0.6-0.1-0.9C11.7,11.7,11.5,11.8,11.3,11.8z"/> <path class="st1" d="M16.4,12.2c-0.2,0-0.4-0.2-0.4-0.4s0.2-0.4,0.4-0.4c0,0,0,0,0,0c-0.1-0.1-0.3-0.2-0.5-0.2 c-0.5,0-0.9,0.6-0.9,1.3c0,0.2,0,0.4,0.1,0.6c0.1-0.1,0.1-0.1,0.3-0.1c0.2,0,0.3,0.1,0.3,0.3c0,0.2-0.1,0.3-0.3,0.3 c0.1,0.1,0.3,0.2,0.5,0.2c0.5,0,0.9-0.6,0.9-1.3c0-0.2,0-0.3-0.1-0.4C16.7,12.1,16.6,12.2,16.4,12.2z"/> <path class="st1" d="M19.9,10.2c0-0.7-0.1-1.4-0.5-1.9c-0.6-1-2-1.1-3-1.3c-1.1-0.2-2.1-0.3-3.2-0.4l-0.8-1.5 c0.3-0.2,0.4-0.5,0.4-0.9c0-0.6-0.5-1.1-1.1-1.1c-0.6,0-1.1,0.5-1.1,1.1c0,0.6,0.4,1.1,1,1.1l-0.1,1.1c-0.1,0-0.3,0-0.4,0 c-1-0.1-2-0.2-3-0.2c-1.1,0-2.4,0.1-3.1,1.1C4.8,7.5,4.7,7.7,4.6,7.9C4.5,8.4,4.4,9,4.4,9.5c0,0.1,0.3,5.2,0.3,5.2 c0.1,0.4,0.1,0.8,0.2,1.2c0.2,1.1,0.6,2.1,1.8,2.2c2,0.2,4.1,0.1,6-0.1c0.9-0.1,1.9-0.2,2.8-0.4c0,0,0,0,0,0 c0.3-0.1,0.6,0.1,0.8,0.4c0.2,0.4,0.2,0.8,0.1,1.2c0,0.2,0.2,0.3,0.3,0.2c0.4-0.2,0.7-0.5,1-0.7c0.6-0.5,1.1-1.2,1.5-1.9 c0.4-0.8,0.5-1.8,0.6-2.7c0,0,0-1.3,0-1.5C19.9,12.8,20.1,10.3,19.9,10.2z M11.5,3.7c0-0.2,0.2-0.4,0.4-0.4c0.2,0,0.4,0.2,0.4,0.4 s-0.2,0.4-0.4,0.4C11.7,4.2,11.5,4,11.5,3.7z M18.7,10.7c0,0.9,0,1.7,0,2.6c0,0.4,0,0.8-0.1,1.2c-0.1,0.9-0.2,1.2-1.1,1.4 c-2.5,0.3-4.9,0.7-7.4,0.7c-0.6,0-1.1,0-1.7,0c-0.1,0-0.2,0-0.4-0.1c-0.1-0.1-0.2-0.2-0.3-0.4c-0.6-1.9-0.8-4-0.6-6 c0-0.5,0-1.1,0.3-1.5c0.4-0.7,2.1-0.3,2.7-0.3c0.4,0,0.8,0,1.3,0.1c0.2,0,0.3,0.1,0.4,0.2c0.2,0.3,0.4,0.7,0.5,0.7 c0.1,0.1,1.9,0.2,2.3,0.2c0.1,0,0.1,0,0.1-0.1L14.9,9c0.1-0.2,0.3-0.3,0.5-0.2c0.7,0.1,1.4,0.2,2.2,0.3c0.5,0.1,0.9,0.3,1,0.8 C18.7,10.2,18.7,10.4,18.7,10.7z"/> </g> </svg>';
}

function setChatGPTButton(container, textDialog) {
  const { left, bottom } = textDialog.getBoundingClientRect();
  container.style.left = `${left + 20}px`;
  container.style.bottom = `${window.innerHeight - bottom + 5}px`;
}


function setContainerPosUnderText(container, textDialog) {
  const pos = getLastTextPosition(textDialog);
  container.style.top = `${Math.ceil(pos.top + pos.height)}px`;
  container.style.left = `${pos.left}px`;
  container.style.width = "330px";
  container.style.position = "absolute";
}


function highlightText(textElement) {
  textElement.focus();
  const selection = window.getSelection();
  selection.selectAllChildren(textElement);
}

function isWithinBounds(XMouse, YMouse, bounds) {
  const { x: xMin, y: yMin, right: XMax, bottom: YMax } = bounds;
  return XMouse >= xMin && XMouse <= XMax && YMouse >= yMin && YMouse <= YMax;
}

function listenToMouseEvent(event) {
  const suggestionsBox = document.getElementsByClassName(SUGGESTIONS_BOX);
  if (suggestionsBox.length==0) return;

  const { clientX: XMouse, clientY: YMouse } = event;
  if (isWithinBounds(XMouse, YMouse, suggestionsBox[0].getBoundingClientRect())) return;

  const chatButton = document.getElementsByClassName(BUTTON);
  if (chatButton.length==0) return;
  if (isWithinBounds(XMouse, YMouse, chatButton[0].getBoundingClientRect())) return;

  suggestionsBox[0].remove();
}

function memoryChange(changes) {
   if (changes.on) {
    enableChatGPTSuggestion = changes.on.newValue === 1;
   }
   if (changes.subject) {
    subjectCompletion = changes.subject.newValue === 1;
   }
}


function removeChatGPTButton() {
  const chatGPTButtonElements = document.getElementsByClassName(BUTTON);
  if (chatGPTButtonElements.length === 0 || document.activeElement === chatGPTButtonElements[0]) return;
  chatGPTButtonElements[0].remove();
}

function removeChatGPTSuggestionBox() {
  const chatGPTSuggestionBoxElements = document.getElementsByClassName(SUGGESTIONS_BOX);
  if (chatGPTSuggestionBoxElements.length === 0) return;
  chatGPTSuggestionBoxElements[0].remove();
}

function createButtonElement() {
  const container = createBaseElement('button', BUTTON);
  container.innerHTML = getChatGPTSvgLogo();
  return container;
}

function setSubject(suggestionText) {
  const subjectField = document.querySelectorAll(SUBJECT_INPUT);
  const subject = suggestionText.childNodes[0].innerText.split(":")[1];
  if (subjectField.length > 0 && subject != undefined) {
    subjectField[0].childNodes[2].value = subject;
    suggestionText.childNodes[0].remove();
  }
}

function setRewriteDialogOnClick(container, bodyInput) {
  container.onclick = () => {
    const rewriteDialogElements = document.getElementsByClassName(REWRITE_DIALOG);
    if (rewriteDialogElements.length > 0) {
      suggestionText = rewriteDialogElements[0].childNodes[0];
      if (suggestionText.id != ERROR_CLASS_NAME) {
        setSubject(suggestionText);
        bodyInput.innerHTML = rewriteDialogElements[0].innerHTML;
      }
      removeChatGPTSuggestionBox();
    }  
  }
}

function renderChatCard(suggestionsBox, bodyInput) {
  const rewriteDialog = createBaseElement('div', REWRITE_DIALOG);
  suggestionsBox.appendChild(rewriteDialog);
  rules = COMPLETE_EMAIL_RULE;
  if (subjectCompletion) {
    rules += COMPLETE_SUBJECT_RULE;
  }

  render(
    <ChatGPTCard question={rules + " \n"
     + bodyInput.innerHTML}/>,
    rewriteDialog,
  );
}

function createSuggestionBoxElement(bodyInput) {
  const suggestionsBox = document.createElement('div'); 
  suggestionsBox.className = SUGGESTIONS_BOX;
  setContainerPosUnderText(suggestionsBox, bodyInput);
  highlightText(bodyInput);
  return suggestionsBox;
}


function setChatGPTButtonOnClick(container, bodyInput) {
  container.onclick = () => {
    removeChatGPTSuggestionBox();
    const suggestionsBox = createSuggestionBoxElement(bodyInput);
    setRewriteDialogOnClick(suggestionsBox, bodyInput);
    renderChatCard(suggestionsBox, bodyInput);
    document.body.appendChild(suggestionsBox);
  };
}

function createChatGPTButton(bodyInput) {
  const container = createButtonElement();
  setChatGPTButtonOnClick(container, bodyInput);
  const father = createBaseElement('div', "no");
  father.setAttribute("style", "position: absolute; z-index: 20000000000;");
  const child = createBaseElement('div', "no");
  child.setAttribute("style", "display: flex; column-gap: 4px;");
  father.appendChild(child);
  child.appendChild(container);
  setChatGPTButton(father, bodyInput);
  document.body.appendChild(father);
}

function handleChatGPTButton(bodyInput) {
  const elementExists = document.getElementsByClassName(BUTTON);
  if (elementExists.length === 0 && document.activeElement === bodyInput) {
    createChatGPTButton(bodyInput);
  } else if (elementExists.length > 0 && document.activeElement !== bodyInput) {
    removeChatGPTButton();
  }
}

function isInNodeList(node, nodeList) {
  for (let i = 0; i < nodeList.length; i++) {
    if (nodeList[i] === node) return true;
  }
  return false;
}

function handleMutations(mutations) {
  mutations.forEach(() => {
    const bodyInput = document.querySelectorAll(NEW_MESSAGE_INPUT, REPLAY_MESSAGE_INPUT); //:Node[]

    if (!enableChatGPTSuggestion) {
      removeChatGPTButton();
    } else {
      if (URL_PATTERN.test(window.location.href)) {
        if (observer_on_new_messages.length < bodyInput.length) {
          observer_on_new_messages.push(new NewMessageObserver(handleChatGPTButton, bodyInput[bodyInput.length-1]));
        } 
      }
    }

    if (bodyInput.length < observer_on_new_messages.length) {
      for (let i=0; i<observer_on_new_messages.length; i++) {
        if (!isInNodeList(observer_on_new_messages[i].getTarget(), bodyInput)) {
          observer_on_new_messages[i].disconnect();
          observer_on_new_messages.splice(i, 1);
          removeChatGPTButton();
          removeChatGPTSuggestionBox();
          break;
        }
      }
    }
  });
}

function run() {
  const div = document.body;
  const observer = new MutationObserver(handleMutations);
  observer.observe(div, {
    attributes: true,
    childList: true,
    characterData: true
  });
  document.addEventListener("click", listenToMouseEvent);
  onChanged(memoryChange);
}

async function getConfigFirst() {
  config = await getUserConfig();
  enableChatGPTSuggestion = config.on;
  subjectCompletion = config.subject;
  run();
}

getConfigFirst();
