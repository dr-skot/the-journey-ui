// Defense against certain webkit bugs
// adapted from Twilio's Javascript SDK

// not implemented yet; we haven't run into these bugs

/**
 * Shim the pause() and play() methods of the given HTMLMediaElement so that
 * we can detect if it was paused unintentionally.
 * @param {HTMLMediaElement} el
 * @param {?function} [onUnintentionallyPaused=null]
 * @returns {{pausedIntentionally: function, unShim: function}}
 */
export function shimMediaElement(el: HTMLMediaElement, onUnintentionallyPaused?: () => void) {
  const origPause = el.pause;
  const origPlay = el.play;

  let pausedIntentionally = false;

  el.pause = () => {
    pausedIntentionally = true;
    return origPause.call(el);
  };

  el.play = () => {
    pausedIntentionally = false;
    return origPlay.call(el);
  };

  const onPause = onUnintentionallyPaused ? () => {
    if (!pausedIntentionally) {
      onUnintentionallyPaused();
    }
  } : null;

  if (onPause) {
    el.addEventListener('pause', onPause);
  }

  return {
    pausedIntentionally() {
      return pausedIntentionally;
    },
    unShim() {
      el.pause = origPause;
      el.play = origPlay;
      if (onPause) {
        el.removeEventListener('pause', onPause);
      }
    }
  };
}


/**
 * Play an HTMLMediaElement if it is paused and not backgrounded.
 * @private
 * @param {HTMLMediaElement} el
 * @returns {void}
 */
function playIfPausedAndNotBackgrounded(el: HTMLMediaElement) {
  const tag = el.tagName.toLowerCase();
  console.warn('Unintentionally paused:', el);

  // NOTE(mmalavalli): When the element is unintentionally paused, we wait one
  // second for the "onvisibilitychange" event on the HTMLDocument to see if the
  // app will be backgrounded. If not, then the element can be safely played.
  Promise.race([
    waitForEvent(document, 'visibilitychange'),
    waitForSomeTime(1000)
  ]).then(() => {
    if (document.visibilityState === 'visible') {
      // TODO implement some version of this check (for a muted local track)
      // NOTE(mmalavalli): We play the inadvertently paused elements only after
      // the LocalAudioTrack is unmuted to work around WebKit Bug 213853.
      //
      // Bug: https://bugs.webkit.org/show_bug.cgi?id=213853
      //
      //localMediaRestartDeferreds.whenResolved('audio')
      Promise.resolve().then(() => {
        console.info(`Playing unintentionally paused <${tag}> element`);
        console.debug('Element:', el);
        return el.play();
      }).then(() => {
        console.info(`Successfully played unintentionally paused <${tag}> element`);
        console.debug('Element:', el);
      }).catch(error => {
        console.warn(`Error while playing unintentionally paused <${tag}> element:`, error, el);
      });
    }
  });
}

function waitForSomeTime(timeoutMS = 10) {
  return new Promise(resolve => setTimeout(resolve, timeoutMS));
}

function waitForEvent(eventTarget: EventTarget, event: string) {
  return new Promise(resolve => {
    eventTarget.addEventListener(event, function onevent(e) {
      eventTarget.removeEventListener(event, onevent);
      resolve(e);
    });
  });
}
