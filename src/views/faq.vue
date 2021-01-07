<template>
	<div class="faq-box">
		<div class="title">Frequently Asked Questions</div>
		<el-collapse v-model="activeNames">
			<el-collapse-item title="1.What is Amz-Buy？" name="1">
				<div>Amz-Buy is a discount platform for Amazon products. We collect the latest transactions to help buyers save
					money and get good products for free. Each user can choose the product they want to buy and buy it on Amazon at
					the lowest price.</div>
			</el-collapse-item>
			<el-collapse-item title="2.How do I get discounted deals?" name="2">
				<div>There are 4 simple steps to get discounts and free gifts</div>
				<div>Step ① Create an Amz-Buy buyer account and complete your information.</div>
				<div>Step ② Apply for a transaction request and contact the seller or wait for the seller’s approval.</div>
				<div>Step ③ After the seller approves your transaction request, purchase the product on Amazon and upload your
					order review.</div>
				<div>Step ④ We confirm your order information and refund the corresponding price of the order payment to your
					PayPal account.</div>
			</el-collapse-item>
			<el-collapse-item title="3.Why did my transaction request fail?" name="3">
				<div>①The number of product requests has reached the limit set by the system.</div>
				<div>②You have added a product that requires points, but your available points are not enough to request a
					transaction.</div>
				<div>③If you do not have any of the above problems, please contact us by email, because this system is still being
					tested, and we look forward to your feedback! robertwells4625@gmail.com</div>
			</el-collapse-item>
			<el-collapse-item title="4.Which Amazon market do support?" name="4">
				<div>Support US, ES, DE, UK, IT, JP, FR, MX, CA. The United States site has the most traffic, followed by Germany,
					the United Kingdom, Spain, and other European countries.</div>
			</el-collapse-item>
			<el-collapse-item title="5.When will my money be refunded to me?" name="5">
				<div>Usually, after the seller confirms that your comment on the order is online, your pp account will receive a
					refund within 48 hours. You can check the refund status under "My Transactions".</div>
			</el-collapse-item>
			<el-collapse-item title="6.Will you include tax? pp tax, Amazon tax" name="6">
				<div>No, the platform does not pay. In addition, sellers can pay taxes and additional shipping fees on Amazon. You
					can negotiate with the seller who will bear the transaction costs!</div>
			</el-collapse-item>
			<el-collapse-item title="7.What payment methods do you support?" name="7">
				<div>We currently only support refunds for PayPal accounts. Only a small number of merchants will refund the
					discount volume or gift card at the request of the buyer.
					Currently, we will only show your PayPal account and Amazon profile to the seller after you purchase and upload
					the order information. Please rest assured that we will protect the privacy of users!</div>
			</el-collapse-item>
			<el-collapse-item title="8.Why was my account suspended?" name="8">
				<div>The reasons why we suspend your account may be as follows:
					①You have submitted the Amazon order and requested a refund on our site, but you still have requested a refund on
					Amazon.</div>
				<div>②Register multiple accounts to earn points by fraud.If your account does not have these behaviors during use,
					please feel free to contact us.</div>
			</el-collapse-item>
		</el-collapse>
	</div>
</template>

<script>
	export default {
		name: 'faq',
		data() {
			return {
				activeNames: ['1', '2', '3', '4']
			}
		}
	}
</script>
