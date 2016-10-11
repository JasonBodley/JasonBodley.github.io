$(function () {
    $(".tabber").click(function () {
        $(".tabber").removeClass("active");
        $(this).addClass("active");
        $(".tabbable").hide();
        var id = $(this).data("id");
        $("#" + id).show();
    });
    var $input = $("input");
    $input.focus($input, function (event) {
        var $target = $(event.target);
        var val = $target.val();
        if (val) {
            $target.val(val.replace(/,/g, ''));
        }
    });
    $input.blur($input, function (event) {
        var $target = $(event.target);
        var value = parseFloat($target.val());
        if (value) {
            var newValue = value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
            $target.val(newValue);
        }
    });
    var PaymentModel = function (month, mortgageAmount, equityLoanAmount, initialRate, variableRate, initialTerm, totalTerm) {
        var self = this;
        self.EquityLoanMonth = (5 * 12);
        self.Base_Interest = 0.0275;
        self.RPI_Increase = 0.01;
        self.MortgageAmount = mortgageAmount;
        self.EquityLoanAmount = equityLoanAmount;
        self.InitialRate = initialRate;
        self.VariableRate = variableRate;
        self.InitialTerm = initialTerm;
        self.TotalTerm = totalTerm;
        self.Month = ko.observable(month);
        self.RepaymentAmount = ko.pureComputed(function () {
            var rate = (self.Month() >= self.InitialTerm) ? self.VariableRate : self.InitialRate;
            var r = parseFloat(rate);
            var t = parseFloat(self.TotalTerm);
            var P = parseFloat(self.MortgageAmount);
            var calc = ((r / 100.00 / 12.00) * P) / (1.00 - (Math.pow((1.00 + (r / 100.00 / 12.00)), (-t))));
            return calc.toFixed(2);
        });
        self.EquityLoanInterest = ko.pureComputed(function () {
            if ((self.Month() >= self.EquityLoanMonth)) {
                var diff = self.Month() - self.EquityLoanMonth;
                var interest = self.Base_Interest;
                while (diff >= 12) {
                    diff -= 12;
                    interest *= (1 + self.RPI_Increase);
                }
                var total = interest * self.EquityLoanAmount;
                var amount = (total / 12.00);
                return parseFloat(amount).toFixed(2);
            }
            else {
                return "---"
            }
        });
        self.Total = ko.pureComputed(function () {
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
        self.Deposit = ko.pureComputed(function () {
            if (self.DepositPercentage()) {
                return self.PropertyValue() * (self.DepositPercentage() / 100.00);
            }
            else {
                return 0;
            }
        }, self);
        self.EquityLoan = ko.observable(el);
        self.EquityLoanAmount = ko.pureComputed(function () {
            if (self.EquityLoan() === true) {
                return self.PropertyValue() * self.EquityLoanPercentile;
            }
            else {
                return 0;
            }
        }, self);
        self.MortgageAmount = ko.pureComputed(function () {
            return self.PropertyValue() - self.Deposit() - self.EquityLoanAmount();
        }, self);
        self.MortgageTermMonths = ko.pureComputed(function () {
            return self.MortgageTermYears() * 12;
        }, self);
        self.Payments = ko.pureComputed(function () {
            var payments = [];
            if (self.MortgageTermMonths && self.MortgageTermMonths() > 0) {
                for (var i = 1; i <= self.MortgageTermMonths(); i++) {
                    var payment = new PaymentModel(i, self.MortgageAmount(), self.EquityLoanAmount(), self.InitialRate(), self.VariableRate(), self.InitialTerm(), self.MortgageTermMonths());
                    payments.push(payment);
                }
            }
            return payments;
        });
        self.GrandTotal = ko.pureComputed(function () {
            var total = parseFloat(0);
            var payments = self.Payments();
            $.each(payments, function () {
                total = total + parseFloat(this.Total());
            });
            return total.toFixed(2);
        });
        self.DepositPercentagesList = ko.observableArray([5, 10]);
        self.EstimatedValueIncreasePercentage = ko.observable(evip);
        self.ProjectedPropertyValue = ko.pureComputed(function () {
            if (self.PropertyValue() && self.EstimatedValueIncreasePercentage() && self.MortgageTermYears()) {
                var pv = parseFloat(self.PropertyValue());
                var evip = parseFloat(self.EstimatedValueIncreasePercentage());
                var m = parseFloat(self.MortgageTermYears());
                var factor = Math.pow(1 + (evip/100.00), m);
                return (pv * factor).toFixed(0);
            }
            else {
                return null;
            }
        });
        self.ProjectedEquityLoanPayment = ko.pureComputed(function () {
            if (self.ProjectedPropertyValue() && self.EquityLoan() === true) {
                var result = self.ProjectedPropertyValue() * self.EquityLoanPercentile;
                return result.toFixed(2);
            }
            else {
                return null;
            }
        });
        self.ProjectedWithEquityLoan = ko.pureComputed(function () {
            if (self.ProjectedEquityLoanPayment()) {
                var result = self.ProjectedPropertyValue() - self.ProjectedEquityLoanPayment();
                return result.toFixed(0);
            }
            else {
                return null;
            }
        });
        self.Rent = ko.observable(r);
        self.HowLongUntil = ko.observable(hlu);
        self.Waste = ko.pureComputed(function() {
           return self.Rent() * self.HowLongUntil(); 
        });
    };
    ko.applyBindings(new ViewModel(180000, 2.00, 4.00, 24, 25, true, 5, 1, 650, 6));
});
