angular.module('starter.controllers', [])

.controller('RegisterCtrl', ['$scope', '$state', 'UserService', '$ionicHistory', '$window', 'SSFAlertsService', '$translate',
    function($scope, $state, UserService, $ionicHistory, $window, SSFAlertsService, $translate) {
        $scope.reg = {};
        $scope.repeat = {};

        function resetFields() {
            $scope.user.email = "";
            $scope.user.firstName = "";
            $scope.user.lastName = "";
            $scope.user.organization = "";
            $scope.user.password = "";
            $scope.repeatPassword.password = "";
        }

        //Required to get the access token
        function loginAfterRegister() {
            UserService.login($scope.user)
            .then(function(response) {
                if (response.status === 200) {
                    //Should return a token
                    $window.localStorage["userID"] = response.data.userId;
                    $window.localStorage['token'] = response.data.id;
                    $ionicHistory.nextViewOptions({
                        historyRoot: true,
                        disableBack: true
                    });
                    $state.go('lobby');
                }
                else {
                    // invalid response
                    $state.go('landing');
                }

                resetFields();
            }, function(response) {
                // something went wrong
                $state.go('landing');
                resetFields();
            });
        }

        $scope.regSubmitForm = function(form) {
            if (form.$valid) {
                if ($scope.repeat.repeatPassword !== $scope.reg.password) {
                    //SSFAlertsService.showAlert("Error", "Oops the Passwords dont match :( try again!");
                    SSFAlertsService.showAlert("ERROR.ERROR_TITLE", "ERROR.PASSWORD_ERROR");
                }
                else {
                    UserService.create($scope.reg)
                    .then(function(response) {
                        if (response.status === 200) {
                            //Should return a token 
                            console.log(response);
                            loginAfterRegister();
                            form.$setPristine();
                        } else if (response.status === 422) {
                            // Code 401 corresponds to Unauthorized access, in this case, the email/password combination was incorrect.
                            // SSFAlertsService.showAlert("Error", "Email and password are already registered."); 
                            SSFAlertsService.showAlert("ERROR.ERROR_TITLE", "ERROR.REGISTERED_ERROR");
                        } else if (response.data === null) {
                            //If the data is null, it means there is no internet connection. 
                            //SSFAlertsService.showAlert("Error", "The connection with the server was unsuccessful, check your internet connection and try again later.");
                                SSFAlertsService.showAlert("ERROR.ERROR_TITLE", "ERROR.CONNECTION_ERROR");
                        } else {
                            // SSFAlertsService.showAlert("Error", "Something went wrong, try again.");
                            SSFAlertsService.showAlert("ERROR.ERROR_TITLE", "ERROR.INVALID_ERROR");
                        }
                    });
                }
            }
        };
    }
])

.controller('LoginCtrl', ['$scope', '$state', 'UserService', '$ionicHistory', 'SSFAlertsService', '$window', '$translate',
    function($scope, $state, UserService, $ionicHistory, SSFAlertsService, $window, $translate) {
        $scope.user = {};
        $scope.title = "Login";

        var rememberMeValue;
        if ($window.localStorage["rememberMe"] === undefined || $window.localStorage["rememberMe"] == "true") {
            rememberMeValue = true;
        }
        else {
            rememberMeValue = false;
        }

        $scope.checkbox = {
            rememberMe: rememberMeValue
        };

        if ($window.localStorage["username"] !== undefined && rememberMeValue === true) {
            $scope.user.email = $window.localStorage["username"];
        }

        $scope.loginSubmitForm = function(form) {
            if (form.$valid) {
                UserService.login($scope.user)
                .then(function(response) {
                    if (response.status === 200) {
                        //Should return a token
                        $window.localStorage["userID"] = response.data.userId;
                        $window.localStorage['token'] = response.data.id;
                        $ionicHistory.nextViewOptions({
                            historyRoot: true,
                            disableBack: true
                        });
                        $state.go('lobby');
                        $window.localStorage["rememberMe"] = $scope.checkbox.rememberMe;
                        if ($scope.checkbox.rememberMe) {
                            $window.localStorage["username"] = $scope.user.email;
                        } else {
                            delete $window.localStorage["username"];
                            $scope.user.email = "";
                        }
                        $scope.user.password = "";
                        form.$setPristine();
                    } else if (response.status === 401) {
                        //SSFAlertsService.showAlert("Error", "Incorrect username or password.");
                        SSFAlertsService.showAlert("ERROR.ERROR_TITLE", "ERROR.INCORRECT_ERROR");
                    } else if (response.data === null) {
                        //If the data is null, it means there is no internet connection. 
                        // SSFAlertsService.showAlert("Error", "The connection with the server was unsuccessful, check your internet connection and try again later.");
                        SSFAlertsService.showAlert("ERROR.ERROR_TITLE", "ERROR.CONNECTION_ERROR");
                    } else {
                        // SSFAlertsService.showAlert("Error", "Something went wrong, try again.");
                        SSFAlertsService.showAlert("ERROR.ERROR_TITLE", "ERROR.INVALID_ERROR");
                    }
                });
            }
        };
    }
])

.controller('LobbyCtrl', ['$scope', '$state', '$ionicHistory', 'UserService', '$window', 'TKQuestionsService', 'ServerQuestionService', 'TKAnswersService', 'SSFAlertsService', '$translate',
    function($scope, $state, $ionicHistory, UserService, $window, TKQuestionsService, ServerQuestionService, TKAnswersService, SSFAlertsService, $translate) {

        /*needs the logout function to be added to documentation
        inorder to control the flow of the controller. Otherwise, 
        when you transfer to lobby it'll automatically logout instead 
        of waiting for a ng-click event to occur.*/

        $scope.$on('$ionicView.enter', function() {
            // Code you want executed every time view is opened
            console.log("reset");
            TKAnswersService.resetAnswers();
            console.log(TKAnswersService.getAnswers());
        });

        $scope.logout = function() {
            UserService.logout($window.localStorage.token)
            .then(function(response) {
                //The successful code for logout is 204
                if (response.status === 204) {
                    delete $window.localStorage['token'];
                    delete $window.localStorage['userID'];
                    $ionicHistory.nextViewOptions({
                        historyRoot: true,
                        disableBack: true
                    });
                    $state.go('landing');
                }
                else {
                    //SSFAlertsService.showAlert("Error", "Could not logout at this moment, try again.");
                    SSFAlertsService.showAlert("ERROR.ERROR_TITLE", "ERROR.INVALID_ERROR");
                }
            }, function(response) {
                // SSFAlertsService.showAlert("Error", "Could not logout at this moment, try again.");
                SSFAlertsService.showAlert("ERROR.ERROR_TITLE", "ERROR.INVALID_ERROR");
            });
        };

        //This is where all of the functions to handle getting the questions for the test set up
        if (TKQuestionsService.questionsLength() === 0)
            getQuestions();

        function getQuestions() { //this is a different function from TKService.js file thats getQuestion
            ServerQuestionService.all($window.localStorage['token'])
            .then(function(response) {
                if (response.status === 200) {
                    var questions = response.data;
                    TKQuestionsService.setQuestions(questions);
                    $window.localStorage.questions = JSON.stringify(questions);
                }
                else if (response.data !== 401) {
                    // invalid response
                    confirmPrompt();
                }
            }, function(response) {
                // something went wrong
                confirmPrompt();
            });
        }

        function confirmPrompt() {
            SSFAlertsService.showConfirm("ERROR.ERROR_TITLE", "ERROR.ANSWER_SAVED_ERROR")
            .then(function(response) {
                if (response == true) {
                    getQuestions();
                }
            });
        }

        $scope.takeTestButtonTapped = function() {
            if (TKQuestionsService.questionsLength() === 0) {
                getQuestions();
            } else {
                $state.go('test.detail', {
                    testID: 1
                });
            }
        };

        //This is where the controller gets the questions 
        //Get Questions Initially if they are not already stored
    }
])

.controller('TestCtrl', ['$scope', 'testInfo', '$stateParams', '$state', '$window', 'TKQuestionsService', 'TKAnswersService', 'ServerAnswersService', '$ionicHistory', 'TKResultsButtonService', 'SSFAlertsService', '$translate', '$filter',
    function($scope, testInfo, $stateParams, $state, $window, TKQuestionsService, TKAnswersService, ServerAnswersService, $ionicHistory, TKResultsButtonService, SSFAlertsService, $translate) {
        //testInfo is passed in the router to obtain the questions
        var qNumber = $stateParams.testID;
        $scope.title = "Question #" + qNumber;

        testInfo.forEach(function(infoDict) {
            if (infoDict.Answer_ID === "A")
                $scope.questionA = infoDict;
            if (infoDict.Answer_ID === "B")
                $scope.questionB = infoDict;
        });

        $scope.$on("$ionicView.beforeEnter", function() {
            var lastQuestionNumber = TKAnswersService.getLastQuestionNumber();
            if (parseInt(qNumber) < lastQuestionNumber) {
                TKAnswersService.setLastQuestionNumber(lastQuestionNumber - 1);
                TKAnswersService.eraseLastAnswer();
            }
            TKAnswersService.setLastQuestionNumber(parseInt(qNumber));
        });

        function performRequest() {
            var answersDict = angular.copy(TKAnswersService.getAnswers());
            answersDict["userID"] = $window.localStorage['userID'];
            var date = new Date();
            answersDict["createDate"] = date.toUTCString();
           
            ServerAnswersService.create(answersDict, $window.localStorage['token'])
            .then(function(response) {
                if (response.status === 200) {
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    TKResultsButtonService.setShouldShowMenuButton(true);
                    $state.go('results');
                }
                else if (response.data !== 401) {
                    // invalid response
                    confirmPrompt();
                }
            }, function(response) {
                // something went wrong
                confirmPrompt();
            });
        }


        function confirmPrompt() {
            SSFAlertsService.showConfirm("ERROR.ERROR_TITLE", "ERROR.ANSWER_SAVED_ERROR")
            .then(function(response) {
                if (response == true) {
                    performRequest();
                } else {
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                }
                TKResultsButtonService.setShouldShowMenuButton(true);
                $state.go('results');
            });
        }


        $scope.buttonClicked = function(option) {
            var category = $scope["question" + option].Style;
            TKAnswersService.saveAnswer(qNumber, category, option);

            var nextqNumber = Number(qNumber) + 1;
            if (nextqNumber > 30) {
                performRequest();
            }
            else {
                $state.go('test.detail', {
                    testID: nextqNumber
                });
            }
        };
    }
])

.controller('ResultsCtrl', ['$scope', 'TKAnswersService', '$ionicHistory', '$state', 'TKResultsButtonService', '$translate',
    function($scope, TKAnswersService, $ionicHistory, $state, TKResultsButtonService, $translate) {

        $scope.menuButtonTapped = function() {
            $ionicHistory.nextViewOptions({
                historyRoot: true,
                disableBack: true
            });
            $state.go('lobby');
        };

        //$scope.labels = ["Competing", "Collaborating", "Compromising", "Avoiding", "Accommodating"];
        //$scope.labels = ["ANSWERS.COMPETING", "ANSWERS.COLLABORATING", "ANSWERS.COMPROMISING", "ANSWERS.AVOIDING", "ANSWERS.ACCOMMODATING"];
               
        $scope.labelsTranslator = function(Competing, Collaborating, Compromising, Avoiding, Accommodating) {
            $translate([Competing, Collaborating, Compromising, Avoiding, Accommodating])
            .then(function(response) {
                $scope.realLabels = [response[Competing], response[Collaborating], response[Compromising], response[Avoiding], response[Accommodating]] ;  
            });
        };
        $scope.labelsTranslator("ANSWERS.COMPETING", "ANSWERS.COLLABORATING", "ANSWERS.COMPROMISING", "ANSWERS.AVOIDING", "ANSWERS.ACCOMMODATING");
        
        $scope.shouldShowButton = TKResultsButtonService.getShouldShowMenuButton();

        var answersInfo = TKAnswersService.getAnswers();

        $scope.data = [
            [returnPercentage(answersInfo["competing"]),
                returnPercentage(answersInfo["collaborating"]),
                returnPercentage(answersInfo["compromising"]),
                returnPercentage(answersInfo["avoiding"]),
                returnPercentage(answersInfo["accommodating"])
            ]
        ];

        $scope.options = {
            scaleIntegersOnly: true,
            animation: false,
            responsive: true,
            maintainAspectRatio: false,
            scaleOverride: true,
            scaleSteps: 4,
            scaleStepWidth: 25,
            scaleStartValue: 0,
            scaleLabel: "<%=value%>" + "%",
            tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value.toFixed(0) %>" + "%",
        };

        $scope.colours = [{
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(15,187,25,1)",
            pointColor: "rgba(15,187,25,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,0.8)"
        }];

        function returnPercentage(value) {
            return (value / 12) * 100;
        }
    }
])

.controller('HistoryCtrl', ['$scope', 'ServerAnswersService', '$window', '$state', 'TKAnswersService', 'TKResultsButtonService', 'SSFAlertsService', '$translate', 'tmhDynamicLocale',
    function($scope, ServerAnswersService, $window, $state, TKAnswersService, TKResultsButtonService, SSFAlertsService, $translate, tmhDynamicLocale) {
        $scope.tests = [];
        performRequest();
        
        if(typeof navigator.globalization !== "undefined") {
            navigator.globalization.getPreferredLanguage(function(language) {
                tmhDynamicLocale.set((language.value).split("-")[0]);
            }, null);
        }
        
        function performRequest() {
            ServerAnswersService.all($window.localStorage['userID'], $window.localStorage['token'])
            .then(function(response) {
                if (response.status === 200) {
                    $scope.tests = response.data;
                }
                else if (response.data !== 401) {
                    // invalid 
                    confirmPrompt();
                }
            }, function(response) {
                // something went wrong
                console.log(response);
                confirmPrompt();
            });
        }

        function confirmPrompt() {
            SSFAlertsService.showConfirm("ERROR.ERROR_TITLE", "ERROR.TEST_RETRIEVED_ERROR")
            .then(function(response) {
                if (response == true) {
                    performRequest();
                }
            });
        }

        $scope.goToResult = function(test) {
            var answers = {
                "competing": test.competing,
                "collaborating": test.collaborating,
                "compromising": test.compromising,
                "avoiding": test.avoiding,
                "accommodating": test.accommodating
            };

            TKAnswersService.setAnswers(answers);
            TKResultsButtonService.setShouldShowMenuButton(false);
            $state.go('results');
        };
    }
]);