import React from 'react';

export default function SnakeBar({acitveStep}) {
  return (
    <div className="snake-bar__container">
      <div className="snake-bar__step">
        <div className={'snake-bar__title ' + (acitveStep === 1 ? 'active-step' : '' )}>
          1 
        </div>
        <span className={acitveStep === 1 ? 'active-step' : ''}> Block unknown caller</span>
      </div>
      <div className="snake-bar__arrow">
        <span>&#10230;</span> 
      </div>
      <div className="snake-bar__step">
        <div className={'snake-bar__title ' + (acitveStep === 2 ? 'active-step' : '' )}>
          2
        </div>
        <span className={acitveStep === 2 ? 'active-step' : ''}> Add Elefend contact</span>
      </div>
      <div className="snake-bar__arrow">
        <span>&#10230;</span> 
      </div>
      <div className="snake-bar__step">
        <div className={'snake-bar__title ' + (acitveStep === 3 ? 'active-step' : '' )}>
         3
        </div> 
        <span className={acitveStep === 3 ? 'active-step' : ''}> Activate call forwarding</span>
      </div>
    </div>  
  )
}

