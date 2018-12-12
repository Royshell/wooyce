import React from 'react';

const PersonalInfoPage = () => (
  <div>
    <h2>PERSONAL</h2>
    <div>
      <label>How old are you?</label>
      <input type='number' />
    </div>
    <div>
      <label>What is your highest level of eduaction?</label>
      <input type="radio" name="education" value="highschool"/> High School
      <input type="radio" name="education" value="ba"/> Bachelor's Degree
      <input type="radio" name="education" value="ma"/> Masters Degree
      <input type="radio" name="education" value="phd"/> Phd.
    </div>
  </div>
);

export default PersonalInfoPage;