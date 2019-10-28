# clientapp-pc

#创建代码签名证书

makecert -pe -n "CN=My SPC" -a sha256 -cy end ^
         -sky signature ^
         -ic MyCA.cer -iv MyCA.pvk ^
         -sv MySPC.pvk MySPC.cer

## 参考文档

https://docs.microsoft.com/zh-cn/windows/msix/package/create-certificate-package-signing



New-SelfSignedCertificate -Type Custom -Subject "CN=Icome Software, O=Icome Corporation, C=CN" -KeyUsage DigitalSignature -FriendlyName "iCome" -CertStoreLocation "Cert:\CurrentUser\My" -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.3", "2.5.29.19={text}")



$pwd = ConvertTo-SecureString -String icomesecret -Force -AsPlainText 
Export-PfxCertificate -cert "Cert:\CurrentUser\My\09BA7C3B672C590AAEF359E9D3A1016BA23FC06E" -FilePath icomecodesign.pfx -Password $pwd
