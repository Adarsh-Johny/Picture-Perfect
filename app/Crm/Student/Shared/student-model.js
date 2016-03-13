
/*student  model*/
function Student(p) {
    var student = p || {};
    this.StudentID = student.StudentID || 0;
    this.StudentIdentifier = student.StudentIdentifier || 0;
    this.Name = student.Name || "";
    this.DOB = student.DOB || "";
    this.Gender = student.Gender || "";
    this.PrimaryAddressID = student.PrimaryAddressID || 0;
    this.SecondaryAddressID = student.SecondaryAddressID || 0;
    this.AddressDetail = new Address(student.AddressDetail);
    this.Mobile = student.Mobile || "";
    this.Email = student.Email || "";

    this.RollNo = student.RollNo || "";
    this.RegistrationNo = student.RegistrationNo || "";
    this.BatchID = student.BatchID || 0;
    this.PrimaryAddressID = student.PrimaryAddressID || 0;
    this.RowVersionStamp = student.RowVersionStamp || "";
}
/*address model*/
function Address(addr) {
    var a = addr || {};
    this.AddressDetailID = a.AddressDetailID || 0;
    this.AddressLine1 = a.AddressLine1 || "";
    this.AddressLine2 = a.AddressLine2 || "";
    this.City = a.City || "";
    this.State = a.State || "";
    this.ZipCode = a.ZipCode || "";
}
