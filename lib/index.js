'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Solstice = function () {
  function Solstice(contEl, options) {
    _classCallCheck(this, Solstice);

    if (!contEl) {
      throw new Error('No Container element supplied');
    }

    this.monthWords = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.timeSTZones = {
      PST: '-08:00',
      MST: '-07:00',
      CST: '-06:00',
      EST: '-05:00',
      AKST: '-09:00',
      HST: '-10:00'
    };

    this.timeDTZones = {
      PDT: '-07:00',
      MDT: '-06:00',
      CDT: '-05:00',
      EDT: '-04:00',
      AKDT: '-08:00',
      HDT: '-09:00'
    };

    this.selector = {
      calendarWrapper: 'solstice-cal',
      monthWrapper: 'solstice-cal-month',
      controls: 'solstice-ctrls',
      prevMonth: 'solstice-prev-month',
      nextMonth: 'solstice-next-month',
      prevYear: 'solstice-prev-year',
      nextYear: 'solstice-next-year',
      selectedDate: 'solstice-selected-date',
      week: 'solstice-week',
      day: 'solstice-day',
      weekDay: 'solstice-week-day',
      columns: 'solstice-columns',
      dayDisplay: 'solstice-day-display',
      monthDisplay: 'solstice-month-Display',
      yearDisplay: 'solstice-year-display',
      hour: 'solstice-hour',
      minute: 'solstice-minute',
      timewrap: 'solstice-timewrap',
      seconds: 'solstice-seconds',
      tzDD: 'solstice-time-zone-select',
      amPm: 'solstice-am-pm',
      separator: 'solstice-time-separator',
      dropdownWrapper: 'solstice-time-dropdown-wrapper'
    };

    this._events = {};
    options = options || {};

    this.selectBy = options.selectBy || 'day';
    this.showYearCtrls = options.showYearCtrls || false;
    this.timeSeparator = options.separator || ':';
    this.containerEl = contEl;
    this.isPM = false;

    var aDate = options.date || new Date();

    this.setDate(aDate);

    this.render();

    this._addDefaultEvents();
  }

  _createClass(Solstice, [{
    key: 'setDate',
    value: function setDate(date) {
      if (date && Object.prototype.toString.call(date) !== '[object Date]' && date !== '') {
        date = new Date(date);
      } else if (!date) {
        date = new Date();
      }

      if (isNaN(date.getTime())) {
        date = new Date();
      }

      this.selectedDate = date;
      this._updateShownDate(date);
    }

    // events

  }, {
    key: 'on',
    value: function on(eventName, callback) {
      // add it to the events object
      if (!callback && typeof callback !== 'function') {
        throw new Error('No Callback was specified or needs to be a function');
      } else {
        if (!this._events[eventName]) {
          this._events[eventName] = [];
        }
        this._events[eventName].push(callback);
      }

      return this;
    }
  }, {
    key: 'off',
    value: function off(eventName, callback) {
      if (!this._events[eventName]) {
        return;
      }
      var index = undefined;
      while ((index = this._events[eventName].indexOf(callback)) > -1) {
        this._events[eventName].splice(index, 1);
      }

      return this;
    }
  }, {
    key: '_emit',
    value: function _emit(eventName) {
      if (this._events[eventName]) {
        var listeners = this._events[eventName];
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0; i < listeners.length; i++) {
          listeners[i].apply(null, args);
        }
      }
    }
  }, {
    key: '_nextMonth',
    value: function _nextMonth() {
      if (this.shownMonth === 11) {
        // next month is 0
        this.shownMonth = 0;
        this.shownYear++;
        this.shownDate.setYear(this.shownYear);
      } else {
        this.shownMonth++;
      }
      this.shownDay = 1;
      this.shownDate.setDate(this.shownDay);
      this.shownDate.setMonth(this.shownMonth);
      this._emit('solstice:monthUpdated');
    }
  }, {
    key: '_prevMonth',
    value: function _prevMonth() {
      if (this.shownMonth === 0) {
        // next month is 0
        this.shownMonth = 11;
        this.shownYear--;
        this.shownDate.setYear(this.shownYear);
      } else {
        this.shownMonth--;
      }
      this.shownDay = 1;
      this.shownDate.setDate(this.shownDay);
      this.shownDate.setMonth(this.shownMonth);
      this._emit('solstice:monthUpdated');
    }
  }, {
    key: '_nextYear',
    value: function _nextYear() {
      this.shownYear++;
      this.shownDate.setYear(this.shownYear);
      this._emit('solstice:yearUpdated');
    }
  }, {
    key: '_prevYear',
    value: function _prevYear() {
      this.shownYear--;
      this.shownDate.setYear(this.shownYear);
      this._emit('solstice:yearUpdated');
    }
  }, {
    key: 'getDate',
    value: function getDate() {
      // get am/pm
      var isPM = this.containerEl.getElementsByClassName(this.selector.amPm)[0].value === 'pm';
      // get hour
      var hour = Number(this.containerEl.getElementsByClassName(this.selector.hour)[0].value);

      if (isPM && hour < 12) {
        hour += 12;
      } else if (hour === 12 && !isPM) {
        hour = 0;
      }

      // get minutes
      var minute = this.containerEl.getElementsByClassName(this.selector.minute)[0].value;

      // get seconds
      var second = this.containerEl.getElementsByClassName(this.selector.seconds)[0].value;

      // get timezone offset
      var tzOffset = this.containerEl.getElementsByClassName(this.selector.tzDD)[0].value;

      this.selectedDate.setHours(hour);
      this.selectedDate.setMinutes(minute);
      this.selectedDate.setSeconds(second);

      return new Date(this._formatToISO(this.selectedDate, tzOffset));
    }
  }, {
    key: 'render',
    value: function render() {
      var docFrag = document.createDocumentFragment();
      // add calendar element
      docFrag.appendChild(this._createCalendar(this.shownDate));
      // add clock element
      docFrag.appendChild(this._createClock());

      if (this.containerEl) {
        this.containerEl.innerHTML = '';
        this.containerEl.appendChild(docFrag);
      }
    }
  }, {
    key: '_createCalendar',
    value: function _createCalendar(date) {
      var wrapper = this._createElement('div', this.selector.calendarWrapper);
      var controls = this._createControls(date);
      var calendar = this._renderDays(date);

      wrapper.appendChild(controls);
      wrapper.appendChild(calendar);

      return wrapper;
    }
  }, {
    key: '_createControls',
    value: function _createControls(shownDate) {
      var controls = this._createElement('div', this.selector.controls);
      var prevMonthCtrl = this._createElement('span', this.selector.prevMonth);
      var nextMonthCtrl = this._createElement('span', this.selector.nextMonth);
      var prevYearCtrl = this._createElement('span', this.selector.prevYear);
      var nextYearCtrl = this._createElement('span', this.selector.nextYear);

      if (this.showYearCtrls) {
        prevYearCtrl.innerText = '<<';
        nextYearCtrl.innerText = '>>';
      }

      var selectedDate = this._buildSelectedDateElement(shownDate);

      prevMonthCtrl.innerText = '<';
      nextMonthCtrl.innerText = '>';

      if (this.showYearCtrls) {
        controls.appendChild(prevYearCtrl);
      }

      controls.appendChild(prevMonthCtrl);
      controls.appendChild(selectedDate);
      controls.appendChild(nextMonthCtrl);

      if (this.showYearCtrls) {
        controls.appendChild(nextYearCtrl);
      }

      return controls;
    }
  }, {
    key: '_renderDays',
    value: function _renderDays() {
      var aDocFrag = document.createDocumentFragment();
      // 5x7 grid
      var month = [];
      // 0's mark empty cell
      var countDate = new Date(this.shownYear, this.shownMonth, 1);
      // gets day of the week
      var startWkDay = countDate.getDay();
      var i = 0;

      while (this.shownMonth === countDate.getMonth()) {
        var week = [];
        if (i === 0) {
          while (week.length !== startWkDay) {
            week.push(0);
          }
        }
        while (week.length < 7 && this.shownMonth === countDate.getMonth()) {
          var dayNum = countDate.getDate();
          week.push(dayNum);
          dayNum += 1;
          countDate.setDate(dayNum);
        }

        if (week.length < 7) {
          while (week.length < 7) {
            week.push(0);
          }
        }
        month.push(week);
        i++;
      }

      var monthEl = this._createElement('div', this.selector.monthWrapper);

      for (var weekInt = 0; weekInt < month.length; weekInt++) {
        var week = month[weekInt];
        var aWeek = this._createElement('div', this.selector.week);
        for (var day = 0; day < week.length; day++) {
          var dayNumber = week[day];
          var dayClasses = dayNumber === this.shownDay ? [this.selector.day, 'solstice-selected'] : this.selector.day;
          var aDay = this._createElement('span', dayClasses);
          if (dayNumber) {
            aDay.innerText = dayNumber;
          }
          aWeek.appendChild(aDay);
        }
        monthEl.appendChild(aWeek);
      }
      aDocFrag.appendChild(monthEl);

      return aDocFrag;
    }
  }, {
    key: '_buildSelectedDateElement',
    value: function _buildSelectedDateElement(date) {
      var el = this._createElement('span', this.selector.selectedDate);
      var updateDate = undefined;

      if (date) {
        updateDate = date;
      } else {
        updateDate = this.getDate();
      }

      var month = this._createElement('span', this.selector.monthDisplay);
      var year = this._createElement('span', this.selector.yearDisplay);

      month.innerText = ' ' + this.monthWords[updateDate.getMonth()] + ' ';
      year.innerText = updateDate.getFullYear() + ' ';

      el.appendChild(month);
      el.appendChild(year);

      return el;
    }
  }, {
    key: '_createClock',
    value: function _createClock() {
      var frag = document.createDocumentFragment();
      var timewrapper = this._createElement('div', this.selector.timewrap);

      // separator
      var separator = this._createElement('span', this.selector.separator);
      separator.innerText = this.timeSeparator;

      var separatorToo = separator.cloneNode(true);
      // Hour
      var hourEl = this._createElement('input', this.selector.hour);
      hourEl.value = this.shownHour;
      // Minute
      var minEl = this._createElement('input', this.selector.minute);
      minEl.value = this.shownMinutes;
      // Seconds
      var secEl = this._createElement('input', this.selector.seconds);
      secEl.value = this.shownSeconds;
      // timezone dropdown
      var tzDD = this._createElement('select', this.selector.tzDD);

      // am/pm dropdown
      var amPmDD = this._createElement('select', this.selector.amPm);
      var amOption = this._createElement('option');
      amOption.value = 'am';
      amOption.innerText = 'AM';

      var pmOption = this._createElement('option');
      pmOption.value = 'pm';
      pmOption.innerText = 'PM';
      var selectedIndex = 0;

      if (this.isPM) {
        pmOption.selected = true;
        selectedIndex = 1;
      } else {
        amOption.selected = true;
      }

      amPmDD.appendChild(amOption);
      amPmDD.appendChild(pmOption);

      amPmDD.selectedIndex = selectedIndex;

      timewrapper.appendChild(hourEl);
      timewrapper.appendChild(separatorToo);
      timewrapper.appendChild(minEl);
      timewrapper.appendChild(separator);
      timewrapper.appendChild(secEl);

      var timeDDWrapper = this._createElement('div', this.selector.dropdownWrapper);
      timeDDWrapper.appendChild(amPmDD);
      tzDD.appendChild(this._createTimeZoneOptions());
      timeDDWrapper.appendChild(tzDD);
      timewrapper.appendChild(timeDDWrapper);

      frag.appendChild(timewrapper);

      return frag;
    }
  }, {
    key: '_handlePrevMonthClick',
    value: function _handlePrevMonthClick() {
      this._prevMonth();
      this.render();
    }
  }, {
    key: '_handleNextMonthClick',
    value: function _handleNextMonthClick() {
      this._nextMonth();
      this.render();
    }
  }, {
    key: '_handlePrevYearClick',
    value: function _handlePrevYearClick(event) {
      this._prevYear(event);
      this.render();
    }
  }, {
    key: '_handleNextYearClick',
    value: function _handleNextYearClick(event) {
      this._nextYear(event);
      this.render();
    }
  }, {
    key: '_handleWeekClick',
    value: function _handleWeekClick(event) {}
  }, {
    key: '_handleDaySelected',
    value: function _handleDaySelected(event) {
      var target = event.target || event.toElement;
      this.selectedDate.setDate(target.innerText);
      this.selectedDate.setMonth(this.shownMonth);
      this.selectedDate.setFullYear(this.shownYear);
      this._updateShownDate(this.selectedDate);
      this.render();
    }
  }, {
    key: '_createElement',
    value: function _createElement(tagType, classes) {
      var el = document.createElement(tagType);
      var classString = '';

      if (classes && classes.join) {
        classString = classes.join(' ');
      } else if (classes) {
        classString = classes;
      }

      el.setAttribute('class', classString);

      return el;
    }
  }, {
    key: '_updateShownDate',
    value: function _updateShownDate(date) {
      // set shown values
      this.shownMonth = date.getMonth();
      this.shownDay = date.getDate();
      this.shownYear = date.getFullYear();

      var hours = date.getHours();
      var isPM = false;

      if (hours > 12) {
        hours -= 12;
        isPM = true;
      } else if (hours === 12) {
        isPM = true;
      } else if (hours === 0) {
        hours = 12;
        isPM = false;
      } else {
        isPM = false;
      }

      this.shownHour = hours;
      this.isPM = isPM;

      this.shownMinutes = this._addLeadingZero(date.getMinutes());
      this.shownSeconds = this._addLeadingZero(date.getSeconds());
      this.shownDate = date;
    }
  }, {
    key: '_delegate',
    value: function _delegate(event) {
      var target = event.target || event.toElement;
      var classList = target.classList;

      if (classList.contains(this.selector.prevMonth)) {
        this._handlePrevMonthClick(event);
      }

      if (classList.contains(this.selector.nextMonth)) {
        this._handleNextMonthClick(event);
      }

      if (classList.contains(this.selector.prevYear)) {
        this._handlePrevYearClick(event);
      }

      if (classList.contains(this.selector.nextYear)) {
        this._handleNextYearClick(event);
      }

      if (classList.contains(this.selector.week) && this.selectBy === 'week') {
        this._handleWeekClick(event);
      }

      if (classList.contains(this.selector.day) && this.selectBy === 'day') {
        this._handleDaySelected(event);
      }
    }
  }, {
    key: '_addDefaultEvents',
    value: function _addDefaultEvents() {
      this.containerEl.onclick = this._delegate.bind(this);
    }
  }, {
    key: '_createTimeZoneOptions',
    value: function _createTimeZoneOptions() {
      var timeFrag = document.createDocumentFragment();
      var timezones = this._getTimeZones();
      var arr = Object.keys(timezones);
      for (var index = 0; index < arr.length; index++) {
        var op = this._createElement('option');
        op.innerText = arr[index];
        op.value = timezones[arr[index]];
        timeFrag.appendChild(op);
      }
      return timeFrag;
    }
  }, {
    key: '_getTimeZones',
    value: function _getTimeZones() {
      var zone = undefined;
      if (this._isDST(this.selectedDate)) {
        zone = this.timeDTZones;
      } else {
        zone = this.timeSTZones;
      }
      return zone;
    }
  }, {
    key: '_isDST',
    value: function _isDST(date) {
      var fullYear = date.getFullYear();
      var jan = new Date(fullYear, 0, 1);
      var jul = new Date(fullYear, 6, 1);
      return date.getTimezoneOffset() < Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    }
  }, {
    key: '_formatToISO',
    value: function _formatToISO(date, timeZoneOffset) {
      var isoString = this.monthWords[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + ' ' + this._addLeadingZero(date.getHours()) + ':' + this._addLeadingZero(date.getMinutes()) + ':' + this._addLeadingZero(date.getSeconds()) + ' GMT ' + timeZoneOffset;
      return isoString;
    }
  }, {
    key: '_addLeadingZero',
    value: function _addLeadingZero(aNumber) {
      aNumber = aNumber < 10 ? '0' + aNumber : aNumber;
      return aNumber.toString();
    }
  }]);

  return Solstice;
}();

exports.default = Solstice;