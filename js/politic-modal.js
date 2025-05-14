document.getElementById("openPolicyModal").onclick = function() {
    document.getElementById("policyModal").style.display = "block";
  }
  document.querySelector(".policy__modal-close").onclick = function() {
    document.getElementById("policyModal").style.display = "none";
  }
  window.onclick = function(event) {
    if (event.target == document.getElementById("policyModal")) {
      document.getElementById("policyModal").style.display = "none";
    }
  }