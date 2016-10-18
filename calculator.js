$(function () {
    $(".tabber").click(function () {
        $(".tabber").removeClass("active");
        $(this).addClass("active");
        $(".tabbable").hide();
        var id = $(this).data("id");
        $("#" + id).show();
    });
    ko.bindingHandlers.textInput = {
        init: function (element, valueAccessor) {
            var va = ko.unwrap(valueAccessor());
            var id = va.id;
            var isNumeric = va.isNumeric || false;
            var decimalplaces = va.decimalplaces;
            var name = va.name || "";
            var type = va.type || "text";
            var value = va.value;
            var placeholder = va.placeholder || "";
            var prepend = va.prepend;
            var append = va.append;
            var readonly = va.readonly || false;
            $(element).addClass("form-group");
            var label = $("<label/>");
            label.text(name);
            label.attr("for", id);
            var inputGroup = $("<div/>");
            inputGroup.addClass("input-group");
            var input = $("<input/>");
            input.attr("type", type);
            input.addClass("form-control");
            input.attr("id", id);
            input.attr("placeholder", placeholder);
            input.focus(input, function (event) {
                var $target = $(event.target);
                var val = $target.val();
                if (isNumeric === true) {
                    if (val) {
                        $target.val(val.replace(/,/g, ''));
                    }
                }
            });
            input.blur(input, function (event) {
                var $target = $(event.target);
                var value = parseFloat($target.val());
                if (isNumeric === true) {
                    if (value) {
                        var dp = (decimalplaces !== undefined) ? decimalplaces : 2;
                        var newValue = value.toFixed(dp).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
                        $target.val(newValue);
                    }
                }
            });
            if (readonly === true) {
                input.attr("readonly", readonly);
            }
            $(element).append(label);
            if (prepend) {
                var inputGroupAddonPrepend = $("<div/>");
                inputGroupAddonPrepend.addClass("input-group-addon");
                inputGroupAddonPrepend.text(prepend);
                inputGroup.append(inputGroupAddonPrepend);
            }
            inputGroup.append(input);
            if (append) {
                var inputGroupAddonAppend = $("<div/>");
                inputGroupAddonAppend.addClass("input-group-addon");
                inputGroupAddonAppend.text(append);
                inputGroup.append(inputGroupAddonAppend);
            }
            $(element).append(inputGroup);
            ko.applyBindingsToNode(input[0], {
                value: value
                , valueUpdate: 'beforeblur'
            }, null);
        }
        , update: function (element, valueAccessor, allBindings) {
            $(element).find("input").blur();
        }
    };
    var $input = $("input");
    var PaymentModel = function (month, mortgageAmount, equityLoanAmount, initialRate, variableRate, initialTerm, totalTerm) {
        var self = this;
        self.EquityLoanMonth = (5 * 12);
        self.Base_Interest = 0.0175;
        self.Base_RPI = 0.02;
        self.MortgageAmount = mortgageAmount;
        self.EquityLoanAmount = equityLoanAmount;
        self.InitialRate = initialRate;
        self.VariableRate = variableRate;
        self.InitialTerm = initialTerm;
        self.TotalTerm = totalTerm;
        self.Month = ko.observable(month);
        self.RepaymentAmount = ko.computed(function () {
            var rate = (self.Month() >= self.InitialTerm) ? self.VariableRate : self.InitialRate;
            var r = parseFloat(rate);
            var t = parseFloat(self.TotalTerm);
            var P = parseFloat(self.MortgageAmount);
            var calc = ((r / 100.00 / 12.00) * P) / (1.00 - (Math.pow((1.00 + (r / 100.00 / 12.00)), (-t))));
            return calc.toFixed(2);
        });
        self.EquityLoanInterestPercentage = ko.observable();
        self.EquityLoanInterest = ko.computed(function () {
            if ((self.Month() > self.EquityLoanMonth)) {
                var diff = self.Month() - self.EquityLoanMonth;
                var interest = self.Base_Interest;
                var rpi = self.Base_RPI;
                while (diff >= 12) {
                    diff -= 12;
                    interest = (interest + (interest * (rpi + 0.01)));
                }
                self.EquityLoanInterestPercentage((interest * 100).toFixed(2));
                var total = interest * self.EquityLoanAmount;
                var amount = (total / 12.00);
                return parseFloat(amount).toFixed(2);
            }
            else {
                self.EquityLoanInterestPercentage("---");
                return "---"
            }
        });
        self.Total = ko.computed(function () {
            var total = 0.00;
            var a = parseFloat(self.RepaymentAmount());
            var i = parseFloat(self.EquityLoanInterest());
            if (a) {
                total += a;
            }
            if (i) {
                total += i;
            }
            return parseFloat(total).toFixed(2);
        });
    };
    var ViewModel = function (pv, ir, vr, it, mt, el, dp, evip, r, hlu) {
        var self = this;
        self.EquityLoanPercentile = 0.20;
        self.DepositPercentage = ko.observable(dp);
        self.PropertyValue = ko.observable(pv);
        self.InitialRate = ko.observable(ir);
        self.VariableRate = ko.observable(vr);
        self.InitialTerm = ko.observable(it);
        self.MortgageTermYears = ko.observable(mt);
        self.Deposit = ko.computed(function () {
            if (self.DepositPercentage()) {
                return parseFloat(self.PropertyValue() * (self.DepositPercentage() / 100.00)).toFixed(2);
            }
            else {
                return 0;
            }
        }, self);
        self.EquityLoan = ko.observable(el);
        self.EquityLoanAmount = ko.computed(function () {
            if (self.EquityLoan() === true) {
                return parseFloat(self.PropertyValue() * self.EquityLoanPercentile).toFixed(2);
            }
            else {
                return 0;
            }
        }, self);
        self.MortgageAmount = ko.computed(function () {
            return self.PropertyValue() - self.Deposit() - self.EquityLoanAmount();
        }, self);
        self.MortgageTermMonths = ko.computed(function () {
            return self.MortgageTermYears() * 12;
        }, self);
        self.Recalculate = ko.observable(false);
        self.recalculatePayments = function () {
            self.Recalculate(true);
        };
        self.Payments = ko.computed(function () {
            var payments = [];
            if (self.MortgageTermMonths && self.MortgageTermMonths() > 0) {
                for (var i = 1; i <= self.MortgageTermMonths(); i++) {
                    var payment = new PaymentModel(i, self.MortgageAmount(), self.EquityLoanAmount(), self.InitialRate(), self.VariableRate(), self.InitialTerm(), self.MortgageTermMonths());
                    payments.push(payment);
                }
            }
            self.Recalculate(false);
            self.Recalculate.notifySubscribers();
            return payments;
        }, self);
        self.GrandTotal = ko.computed(function () {
            var total = parseFloat(0);
            var payments = self.Payments();
            $.each(payments, function () {
                total = total + parseFloat(this.Total());
            });
            return total.toFixed(2);
        });
        self.DepositPercentagesList = ko.observableArray([5, 10]);
        self.EstimatedValueIncreasePercentage = ko.observable(evip);
        self.ProjectedPropertyValue = ko.computed(function () {
            if (self.PropertyValue() && self.EstimatedValueIncreasePercentage() && self.MortgageTermYears()) {
                var pv = parseFloat(self.PropertyValue());
                var evip = parseFloat(self.EstimatedValueIncreasePercentage());
                var m = parseFloat(self.MortgageTermYears());
                var factor = Math.pow(1 + (evip / 100.00), m);
                return (pv * factor).toFixed(0);
            }
            else {
                return null;
            }
        }, self);
        self.ProjectedEquityLoanPayment = ko.computed(function () {
            if (self.ProjectedPropertyValue() && self.EquityLoan() === true) {
                var result = self.ProjectedPropertyValue() * self.EquityLoanPercentile;
                return result.toFixed(2);
            }
            else {
                return null;
            }
        }, self);
        self.ProjectedWithEquityLoan = ko.computed(function () {
            if (self.ProjectedEquityLoanPayment()) {
                var result = self.ProjectedPropertyValue() - self.ProjectedEquityLoanPayment();
                return result.toFixed(0);
            }
            else {
                return null;
            }
        }, self);
        self.Rent = ko.observable(r);
        self.HowLongUntil = ko.observable(hlu);
        self.Waste = ko.computed(function () {
            return self.Rent() * self.HowLongUntil();
        });
    };
    ko.applyBindings(new ViewModel(180000, 2.00, 4.00, 24, 25, true, 5, 1));
    $input.blur();
});